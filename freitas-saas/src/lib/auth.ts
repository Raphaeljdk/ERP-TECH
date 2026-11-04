import "server-only";
import bcrypt from "bcryptjs";
import {SignJWT,jwtVerify} from "jose";
import {cookies} from "next/headers";
import {centralDb,tenantDb} from "./db";
import type {Pool} from "pg";
export type Role="owner"|"manager"|"cashier"|"operator"|"inspector"|"viewer";
const cookieName="freitas_session";
function secret():Uint8Array{
 const s=process.env.SESSION_SECRET;
 if(!s||s.length<32)throw new Error("SESSION_SECRET exige pelo menos 32 caracteres");
 return new TextEncoder().encode(s);
}
export async function issueSession(userId:string,tenantId:string):Promise<string>{
 return new SignJWT({tenantId}).setProtectedHeader({alg:"HS256"})
  .setSubject(userId).setIssuedAt().setExpirationTime("8h").sign(secret());
}
export async function readSession(){
 const c=await cookies();const token=c.get(cookieName)?.value;
 if(!token)return null;
 try{
 const {payload}=await jwtVerify(token,secret(),{algorithms:["HS256"]});
 return typeof payload.sub==="string"&&typeof payload.tenantId==="string"?{userId:payload.sub,tenantId:payload.tenantId}:null;
 }catch{return null;}
}
export const sessionCookie=cookieName;
export {bcrypt};
export async function context():Promise<{userId:string;tenantId:string;role:Role;db:Pool}>{
 const session=await readSession();
 if(!session)throw new AuthError(401,"Faça login para continuar");
 const res=await centralDb().query(
  `SELECT m.role,t.connection_ciphertext,t.status
   FROM memberships m JOIN tenants t ON t.id=m.tenant_id
   JOIN platform_users u ON u.id=m.user_id
   WHERE m.user_id=$1 AND m.tenant_id=$2 AND u.active=true`,
  [session.userId,session.tenantId]);
 if(!res.rowCount)throw new AuthError(403,"Acesso não autorizado");
 const row=res.rows[0];
 if(row.status==="suspended")throw new AuthError(403,"Empresa suspensa");
 return {userId:session.userId,tenantId:session.tenantId,role:row.role,db:tenantDb(session.tenantId,row.connection_ciphertext)};
}
export class AuthError extends Error{
 constructor(public status:number,message:string){super(message);}
}
export function authorize(role:Role,allowed:Role[]){
 if(!allowed.includes(role))throw new AuthError(403,"Permissão insuficiente");
}
export function errorResponse(err:unknown):Response{
 if(err instanceof AuthError)return Response.json({error:err.message},{status:err.status});
 console.error("Freitas ERP request failed",err instanceof Error?err.name:"unknown");
 return Response.json({error:"Não foi possível concluir a operação"},{status:500});
}
