import {cookies} from "next/headers";
import {z} from "zod";
import {centralDb} from "@/lib/db";
import {bcrypt,issueSession,sessionCookie,errorResponse} from "@/lib/auth";
import {sameOrigin} from "@/lib/security";
const input=z.object({email:z.email(),password:z.string().min(1).max(200),tenantId:z.uuid().optional()}).strict();
export async function POST(req:Request){
 try{
 sameOrigin(req);
 const parsed=input.safeParse(await req.json());
 if(!parsed.success)return Response.json({error:"Credenciais inválidas"},{status:400});
 const {email,password,tenantId}=parsed.data;
 const normalized=email.trim().toLowerCase();
 const db=centralDb();
 const tries=await db.query(`INSERT INTO login_attempts(subject,attempts,window_started_at)
 VALUES($1,1,now()) ON CONFLICT(subject) DO UPDATE SET
 attempts=CASE WHEN login_attempts.window_started_at < now()-interval '15 minutes' THEN 1 ELSE login_attempts.attempts+1 END,
 window_started_at=CASE WHEN login_attempts.window_started_at < now()-interval '15 minutes' THEN now() ELSE login_attempts.window_started_at END
 RETURNING attempts`,[normalized]);
 if(tries.rows[0].attempts>10)return Response.json({error:"Muitas tentativas. Aguarde 15 minutos."},{status:429});
 const users=await db.query("SELECT id,password_hash FROM platform_users WHERE lower(email)=$1 AND active=true",[normalized]);
 const user=users.rows[0];
 const ok=user?await bcrypt.compare(password,user.password_hash):false;
 if(!ok)return Response.json({error:"E-mail ou senha incorretos"},{status:401});
 const tenants=await db.query(`SELECT t.id,t.name,m.role FROM memberships m JOIN tenants t ON t.id=m.tenant_id
 WHERE m.user_id=$1 AND t.status<>'suspended' AND ($2::uuid IS NULL OR t.id=$2::uuid)
 ORDER BY t.created_at ASC LIMIT 1`,[user.id,tenantId||null]);
 if(!tenants.rowCount)return Response.json({error:"Empresa sem acesso ativo"},{status:403});
 const tenant=tenants.rows[0];
 const token=await issueSession(user.id,tenant.id);
 const jar=await cookies();
 jar.set(sessionCookie,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:28800});
 await db.query("DELETE FROM login_attempts WHERE subject=$1",[normalized]);
 return Response.json({userId:user.id,tenant:{id:tenant.id,name:tenant.name},role:tenant.role});
 }catch(e){return errorResponse(e);}
}
