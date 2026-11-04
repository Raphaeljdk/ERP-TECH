import {context,errorResponse} from "@/lib/auth";
import {isResource,schema,canWrite} from "@/lib/resources";
import {sameOrigin} from "@/lib/security";
export async function GET(req:Request,{params}:{params:Promise<{resource:string}>}){
 try{
 const {resource}=await params;
 if(!isResource(resource))return Response.json({error:"Recurso inexistente"},{status:404});
 const c=await context();
 const q=new URL(req.url).searchParams;
 const limit=Math.max(1,Math.min(100,Number(q.get("limit"))||40));
 const offset=Math.max(0,Math.min(10000,Number(q.get("offset"))||0));
 const result=await c.db.query(`SELECT * FROM "${resource}" ORDER BY created_at DESC LIMIT $1 OFFSET $2`,[limit,offset]);
 return Response.json({items:result.rows,limit,offset});
 }catch(e){return errorResponse(e);}
}
export async function POST(req:Request,{params}:{params:Promise<{resource:string}>}){
 try{
 sameOrigin(req);
 const {resource}=await params;
 if(!isResource(resource))return Response.json({error:"Recurso inexistente"},{status:404});
 const c=await context();
 if(!canWrite(resource,c.role))return Response.json({error:"Permissão insuficiente"},{status:403});
 const parsed=schema[resource].safeParse(await req.json());
 if(!parsed.success)return Response.json({error:"Dados inválidos",issues:parsed.error.issues},{status:400});
 const values=Object.entries(parsed.data).filter(([,v])=>v!==undefined);
 if(!values.length)return Response.json({error:"Dados vazios"},{status:400});
 const columns=values.map(([k])=>`"${k}"`).join(",");
 const binds=values.map((_,i)=>`$${i+1}`).join(",");
 const conn=await c.db.connect();
 try{
 await conn.query("BEGIN");
 const result=await conn.query(`INSERT INTO "${resource}" (${columns}) VALUES (${binds}) RETURNING *`,values.map(x=>x[1]));
 const row=result.rows[0];
 await conn.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,$2,$3,$4,$5::jsonb)",[c.userId,"create",resource,row.id,JSON.stringify({fields:Object.keys(parsed.data)})]);
 await conn.query("COMMIT");
 return Response.json(row,{status:201});
 }catch(e){await conn.query("ROLLBACK");throw e;}finally{conn.release();}
 }catch(e){return errorResponse(e);}
}
