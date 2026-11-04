import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin,validId} from "@/lib/security";
const input=z.object({
 part:z.string().min(1).max(80),kind:z.enum(["scratch","dent","crack","broken","dirt","other"]),
 severity:z.enum(["low","medium","high"]),notes:z.string().max(1000).optional(),
 position:z.tuple([z.number().finite().min(-100).max(100),z.number().finite().min(-100).max(100),z.number().finite().min(-100).max(100)]).optional()
}).strict();
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 try{
 sameOrigin(req);const {id}=await params;if(!validId(id))return Response.json({error:"Vistoria inválida"},{status:400});
 const c=await context();authorize(c.role,["owner","manager","inspector"]);
 const parsed=input.safeParse(await req.json());if(!parsed.success)return Response.json({error:"Marcação inválida",issues:parsed.error.issues},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const inspection=await db.query("SELECT status FROM inspections WHERE id=$1 FOR UPDATE",[id]);
 if(!inspection.rowCount||inspection.rows[0].status!=="draft"){await db.query("ROLLBACK");return Response.json({error:"Vistoria encerrada ou inexistente"},{status:409});}
 const p=parsed.data.position||[null,null,null];
 const r=await db.query(`INSERT INTO inspection_marks(inspection_id,part,kind,severity,coordinate_x,coordinate_y,coordinate_z,notes,created_by)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,[id,parsed.data.part,parsed.data.kind,parsed.data.severity,...p,parsed.data.notes||null,c.userId]);
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'create','inspection_mark',$2,$3::jsonb)",[c.userId,r.rows[0].id,JSON.stringify({inspection:id})]);
 await db.query("COMMIT");return Response.json(r.rows[0],{status:201});
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
