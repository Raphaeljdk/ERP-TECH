import {context,errorResponse} from "@/lib/auth";
import {centralDb} from "@/lib/db";
export async function GET(){
 try{
 const c=await context();
 const r=await centralDb().query("SELECT name,status FROM tenants WHERE id=$1",[c.tenantId]);
 return Response.json({userId:c.userId,tenantId:c.tenantId,role:c.role,tenant:r.rows[0]});
 }catch(e){return errorResponse(e);}
}
