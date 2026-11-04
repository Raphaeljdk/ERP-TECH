import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin} from "@/lib/security";
const input=z.object({stock_item_id:z.uuid(),delta:z.number().finite().min(-1000000).max(1000000).refine(v=>v!==0),reason:z.string().trim().min(5).max(250)}).strict();
export async function POST(req:Request){
 try{
 sameOrigin(req);const c=await context();authorize(c.role,["owner","manager"]);
 const parsed=input.safeParse(await req.json());if(!parsed.success)return Response.json({error:"Movimentação inválida"},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const item=await db.query("SELECT * FROM stock_items WHERE id=$1 FOR UPDATE",[parsed.data.stock_item_id]);
 if(!item.rowCount){await db.query("ROLLBACK");return Response.json({error:"Produto não encontrado"},{status:404});}
 const next=Number(item.rows[0].quantity)+parsed.data.delta;
 if(next<0||!Number.isFinite(next)){await db.query("ROLLBACK");return Response.json({error:"Estoque insuficiente"},{status:422});}
 const movement=await db.query("INSERT INTO stock_movements(stock_item_id,delta,reason,actor_id) VALUES($1,$2,$3,$4) RETURNING *",[parsed.data.stock_item_id,parsed.data.delta,parsed.data.reason,c.userId]);
 await db.query("UPDATE stock_items SET quantity=$2 WHERE id=$1",[parsed.data.stock_item_id,next]);
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'move','stock_item',$2,$3::jsonb)",[c.userId,parsed.data.stock_item_id,JSON.stringify({delta:parsed.data.delta,reason:parsed.data.reason})]);
 await db.query("COMMIT");return Response.json({movement:movement.rows[0],new_quantity:next},{status:201});
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
