import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin} from "@/lib/security";
const input=z.object({customer_id:z.uuid(),vehicle_id:z.uuid(),items:z.array(z.object({service_id:z.uuid(),quantity:z.number().int().min(1).max(20)}).strict()).min(1).max(30),notes:z.string().max(1000).optional()}).strict();
export async function GET(){
 try{const c=await context();const r=await c.db.query(`SELECT o.*,c.name AS customer_name,v.plate,v.model FROM orders o
 JOIN customers c ON c.id=o.customer_id JOIN vehicles v ON v.id=o.vehicle_id ORDER BY o.opened_at DESC LIMIT 100`);
 return Response.json({items:r.rows});}catch(e){return errorResponse(e);}
}
export async function POST(req:Request){
 try{
 sameOrigin(req);const c=await context();authorize(c.role,["owner","manager","operator","cashier"]);
 const p=input.safeParse(await req.json());if(!p.success)return Response.json({error:"Comanda inválida",issues:p.error.issues},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const vehicle=await db.query("SELECT id FROM vehicles WHERE id=$1 AND customer_id=$2",[p.data.vehicle_id,p.data.customer_id]);
 if(!vehicle.rowCount){await db.query("ROLLBACK");return Response.json({error:"Cliente e veículo não conferem"},{status:422});}
 let total=0;const lineItems:{service_id:string;quantity:number;name:string;price_cents:number}[]=[];
 for(const item of p.data.items){
 const r=await db.query("SELECT id,name,price_cents FROM services WHERE id=$1 AND active=true",[item.service_id]);
 if(!r.rowCount){await db.query("ROLLBACK");return Response.json({error:"Serviço inexistente ou desativado"},{status:422});}
 const svc=r.rows[0];total+=svc.price_cents*item.quantity;
 if(!Number.isSafeInteger(total)||total>100000000){await db.query("ROLLBACK");return Response.json({error:"Valor fora do limite"},{status:422});}
 lineItems.push({service_id:svc.id,quantity:item.quantity,name:svc.name,price_cents:svc.price_cents});
 }
 const o=await db.query("INSERT INTO orders(customer_id,vehicle_id,total_cents,notes) VALUES($1,$2,$3,$4) RETURNING *",[p.data.customer_id,p.data.vehicle_id,total,p.data.notes||null]);
 for(const item of lineItems)await db.query("INSERT INTO order_items(order_id,service_id,description,quantity,unit_price_cents) VALUES($1,$2,$3,$4,$5)",[o.rows[0].id,item.service_id,item.name,item.quantity,item.price_cents]);
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'create','order',$2,$3::jsonb)",[c.userId,o.rows[0].id,JSON.stringify({total_cents:total})]);
 await db.query("COMMIT");
 return Response.json(o.rows[0],{status:201});
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
