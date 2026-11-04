import {context,errorResponse} from "@/lib/auth";
import {isResource,schema,canWrite} from "@/lib/resources";
import {validId,sameOrigin} from "@/lib/security";
export async function GET(_request:Request,{params}:{params:Promise<{resource:string;id:string}>}){
 try{const {resource,id}=await params;
 if(!isResource(resource)||!validId(id))return Response.json({error:"Não encontrado"},{status:404});
 const c=await context();
 const rows=await c.db.query(`SELECT * FROM "${resource}" WHERE id=$1`,[id]);
 return rows.rowCount?Response.json(rows.rows[0]):Response.json({error:"Não encontrado"},{status:404});
 }catch(e){return errorResponse(e);}
}
export async function PATCH(req:Request,{params}:{params:Promise<{resource:string;id:string}>}){
 try{
 sameOrigin(req);const {resource,id}=await params;
 if(!isResource(resource)||!validId(id))return Response.json({error:"Não encontrado"},{status:404});
 const c=await context();
 if(!canWrite(resource,c.role))return Response.json({error:"Permissão insuficiente"},{status:403});
 const input=await req.json();
 const parsed=schema[resource].partial().safeParse(input);
 if(!parsed.success)return Response.json({error:"Dados inválidos",issues:parsed.error.issues},{status:400});
 const entries=Object.entries(parsed.data).filter(([,v])=>v!==undefined);
 if(!entries.length)return Response.json({error:"Nada para alterar"},{status:400});
 const set=entries.map(([k],i)=>`"${k}"=$${i+1}`).join(",");
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const r=await db.query(`UPDATE "${resource}" SET ${set} WHERE id=$${entries.length+1} RETURNING *`,[...entries.map(x=>x[1]),id]);
 if(!r.rowCount){await db.query("ROLLBACK");return Response.json({error:"Não encontrado"},{status:404});}
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'update',$2,$3,$4::jsonb)",[c.userId,resource,id,JSON.stringify({fields:entries.map(x=>x[0])})]);
 await db.query("COMMIT");
 return Response.json(r.rows[0]);
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
