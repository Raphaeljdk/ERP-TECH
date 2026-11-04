import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin,validId} from "@/lib/security";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string;markId:string}>}){
 try{
 sameOrigin(req);const {id,markId}=await params;
 if(!validId(id)||!validId(markId))return Response.json({error:"ID inválido"},{status:400});
 const c=await context();authorize(c.role,["owner","manager","inspector"]);
 const p=z.object({reason:z.string().trim().min(5).max(500)}).strict().safeParse(await req.json());
 if(!p.success)return Response.json({error:"Justificativa obrigatória"},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const r=await db.query(`UPDATE inspection_marks SET retracted_at=now(),retracted_by=$3,retraction_reason=$4
 WHERE id=$1 AND inspection_id=$2 AND retracted_at IS NULL AND EXISTS
 (SELECT 1 FROM inspections WHERE inspections.id=$2 AND status='draft') RETURNING *`,[markId,id,c.userId,p.data.reason]);
 if(!r.rowCount){await db.query("ROLLBACK");return Response.json({error:"Marcação não alterável"},{status:409});}
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'retract','inspection_mark',$2,$3::jsonb)",[c.userId,markId,JSON.stringify({reason:p.data.reason})]);
 await db.query("COMMIT");return Response.json(r.rows[0]);
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
