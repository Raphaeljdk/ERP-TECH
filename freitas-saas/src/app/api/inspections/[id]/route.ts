import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin,validId} from "@/lib/security";
const checklist=z.object({body:z.boolean(),glass:z.boolean(),wheels:z.boolean(),interior:z.boolean(),customerAcknowledged:z.boolean()}).strict();
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 try{const {id}=await params;if(!validId(id))return Response.json({error:"ID inválido"},{status:400});
 const c=await context();const r=await c.db.query("SELECT * FROM inspections WHERE id=$1",[id]);
 if(!r.rowCount)return Response.json({error:"Não encontrado"},{status:404});
 const marks=await c.db.query("SELECT * FROM inspection_marks WHERE inspection_id=$1 ORDER BY created_at",[id]);
 return Response.json({...r.rows[0],marks:marks.rows});
 }catch(e){return errorResponse(e);}
}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 try{
 sameOrigin(req);const {id}=await params;if(!validId(id))return Response.json({error:"ID inválido"},{status:400});
 const c=await context();authorize(c.role,["owner","manager","inspector"]);
 const p=checklist.safeParse((await req.json()).checklist);
 if(!p.success||!Object.values(p.data).every(Boolean))return Response.json({error:"Checklist precisa estar totalmente concluído"},{status:422});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const r=await db.query("UPDATE inspections SET checklist=$2::jsonb,status='completed',completed_at=now() WHERE id=$1 AND status='draft' RETURNING *",[id,JSON.stringify(p.data)]);
 if(!r.rowCount){await db.query("ROLLBACK");return Response.json({error:"Vistoria inexistente ou já concluída"},{status:409});}
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'complete','inspection',$2,'{}'::jsonb)",[c.userId,id]);
 await db.query("COMMIT");return Response.json(r.rows[0]);
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
