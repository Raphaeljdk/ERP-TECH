import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin,validId} from "@/lib/security";
export async function GET(req:Request){
 try{
 const c=await context();const id=new URL(req.url).searchParams.get("order_id");
 if(!id||!validId(id))return Response.json({error:"Comanda inválida"},{status:400});
 const r=await c.db.query("SELECT * FROM inspections WHERE order_id=$1",[id]);
 if(!r.rowCount)return Response.json({inspection:null});
 const marks=await c.db.query("SELECT * FROM inspection_marks WHERE inspection_id=$1 ORDER BY created_at",[r.rows[0].id]);
 return Response.json({inspection:{...r.rows[0],marks:marks.rows}});
 }catch(e){return errorResponse(e);}
}
export async function POST(req:Request){
 try{
 sameOrigin(req);const c=await context();authorize(c.role,["owner","manager","operator","inspector"]);
 const p=z.object({order_id:z.uuid()}).safeParse(await req.json());
 if(!p.success)return Response.json({error:"Comanda inválida"},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const o=await db.query("SELECT status FROM orders WHERE id=$1 FOR UPDATE",[p.data.order_id]);
 if(!o.rowCount||!["AWAITING","INSPECTION"].includes(o.rows[0].status)){
 await db.query("ROLLBACK");return Response.json({error:"Comanda não está em etapa de vistoria"},{status:422});
 }
 const result=await db.query("INSERT INTO inspections(order_id) VALUES($1) ON CONFLICT(order_id) DO UPDATE SET order_id=excluded.order_id RETURNING *",[p.data.order_id]);
 await db.query("COMMIT");return Response.json(result.rows[0]);
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
