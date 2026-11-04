import "server-only";
import {Pool} from "pg";
import {createDecipheriv} from "node:crypto";
const centralUrl=process.env.CENTRAL_DATABASE_URL;
let central:Pool|undefined;
const tenantPools=new Map<string,Pool>();
export function centralDb():Pool{
 if(!centralUrl)throw new Error("CENTRAL_DATABASE_URL ausente. Acesso real desabilitado.");
 if(!central)central=new Pool({connectionString:centralUrl,ssl:centralUrl.includes("localhost")?undefined:{rejectUnauthorized:true},max:4});
 return central;
}
function decrypt(value:string):string{
 const keyHex=process.env.MASTER_ENCRYPTION_KEY;
 if(!keyHex||!/^[a-f0-9]{64}$/i.test(keyHex))throw new Error("MASTER_ENCRYPTION_KEY inválida");
 const [ivHex,tagHex,cipherHex]=value.split(":");
 if(!ivHex||!tagHex||!cipherHex)throw new Error("Conexão de empresa inválida");
 const d=createDecipheriv("aes-256-gcm",Buffer.from(keyHex,"hex"),Buffer.from(ivHex,"hex"));
 d.setAuthTag(Buffer.from(tagHex,"hex"));
 return Buffer.concat([d.update(Buffer.from(cipherHex,"hex")),d.final()]).toString("utf8");
}
export function tenantDb(tenantId:string, encryptedUrl:string):Pool{
 let pool=tenantPools.get(tenantId);
 if(!pool){
  const url=decrypt(encryptedUrl);
  if(!url.startsWith("postgresql://")&&!url.startsWith("postgres://"))throw new Error("Banco inválido");
  pool=new Pool({connectionString:url,ssl:url.includes("localhost")?undefined:{rejectUnauthorized:true},max:3});
  tenantPools.set(tenantId,pool);
 }
 return pool;
}
