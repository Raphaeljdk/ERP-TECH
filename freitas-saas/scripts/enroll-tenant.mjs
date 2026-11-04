// Cadastro inicial feito SOMENTE por operador autorizado após provisionar bancos separados.
// Requer CENTRAL_DATABASE_URL, TENANT_DATABASE_URL, MASTER_ENCRYPTION_KEY,
// ADMIN_EMAIL, ADMIN_PASSWORD, TENANT_NAME, TENANT_SLUG. Não imprime segredos.
import pg from "pg";
import bcrypt from "bcryptjs";
import {randomBytes,createCipheriv} from "node:crypto";
const required=["CENTRAL_DATABASE_URL","TENANT_DATABASE_URL","MASTER_ENCRYPTION_KEY","ADMIN_EMAIL","ADMIN_PASSWORD","TENANT_NAME","TENANT_SLUG"];
for(const k of required)if(!process.env[k])throw Error("Variável obrigatória ausente: "+k);
if(!/^[a-f0-9]{64}$/i.test(process.env.MASTER_ENCRYPTION_KEY))throw Error("Chave AES-256 inválida");
if(process.env.ADMIN_PASSWORD.length<12)throw Error("Senha precisa ter pelo menos 12 caracteres");
if(!/^[a-z0-9-]{3,48}$/.test(process.env.TENANT_SLUG))throw Error("Slug inválido");
const iv=randomBytes(12);
const cipher=createCipheriv("aes-256-gcm",Buffer.from(process.env.MASTER_ENCRYPTION_KEY,"hex"),iv);
const encrypted=Buffer.concat([cipher.update(process.env.TENANT_DATABASE_URL,"utf8"),cipher.final()]);
const sealed=[iv.toString("hex"),cipher.getAuthTag().toString("hex"),encrypted.toString("hex")].join(":");
const pool=new pg.Pool({connectionString:process.env.CENTRAL_DATABASE_URL,ssl:process.env.CENTRAL_DATABASE_URL.includes("localhost")?undefined:{rejectUnauthorized:true}});
const client=await pool.connect();
try{
 await client.query("BEGIN");
 const hash=await bcrypt.hash(process.env.ADMIN_PASSWORD,12);
 const u=await client.query("INSERT INTO platform_users(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash RETURNING id",[process.env.ADMIN_EMAIL.trim().toLowerCase(),hash]);
 const t=await client.query("INSERT INTO tenants(slug,name,connection_ciphertext) VALUES($1,$2,$3) RETURNING id",[process.env.TENANT_SLUG,process.env.TENANT_NAME,sealed]);
 await client.query("INSERT INTO memberships(user_id,tenant_id,role) VALUES($1,$2,'owner')",[u.rows[0].id,t.rows[0].id]);
 await client.query("COMMIT");
 console.log("Empresa de homologação cadastrada com sucesso. Identificador:",t.rows[0].id);
}catch(e){await client.query("ROLLBACK");console.error("Provisionamento não concluído:",e.code||e.name);process.exitCode=1;}
finally{client.release();await pool.end();}
