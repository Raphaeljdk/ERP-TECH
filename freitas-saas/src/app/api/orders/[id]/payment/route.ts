import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin,validId} from "@/lib/security";
const input=z.object({
 amount_cents:z.number().int().min(1).max(100000000),
 method:z.enum(["cash","pix_confirmed","card_confirmed"]),
 reference:z.string().trim().max(120).optional()
}).strict().superRefine((v,ctx)=>{if(v.method!=="cash"&&!v.reference)ctx.addIssue({code:"custom",message:"Confirmação externa obrigatória",path:["reference"]});});
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 try{
 sameOrigin(req);const {id}=await params;if(!validId(id))return Response.json({error:"Comanda inválida"},{status:400});
 const c=await context();authorize(c.role,["owner","manager","cashier"]);
 const idem=req.headers.get("idempotency-key");
 if(!idem||!/^[A-Za-z0-9_-]{12,100}$/.test(idem))return Response.json({error:"Cabeçalho Idempotency-Key obrigatório (12-100 caracteres)"},{status:400});
 const parsed=input.safeParse(await req.json());if(!parsed.success)return Response.json({error:"Pagamento inválido",issues:parsed.error.issues},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const duplicate=await db.query("SELECT order_id,amount_cents FROM financial_entries WHERE idempotency_key=$1",[idem]);
 if(duplicate.rowCount){await db.query("ROLLBACK");
 if(duplicate.rows[0].order_id!==id||Number(duplicate.rows[0].amount_cents)!==parsed.data.amount_cents)return Response.json({error:"Chave já utilizada para outro pagamento"},{status:409});
 return Response.json({alreadyRecorded:true});
 }
 const order=await db.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE",[id]);
 if(!order.rowCount){await db.query("ROLLBACK");return Response.json({error:"Comanda não encontrada"},{status:404});}
 const o=order.rows[0];
 if(["CANCELLED","DELIVERED"].includes(o.status)||o.paid_cents+parsed.data.amount_cents>o.total_cents){
 await db.query("ROLLBACK");return Response.json({error:"Pagamento supera saldo ou comanda encerrada"},{status:422});
 }
 const cash=await db.query("SELECT id FROM cash_sessions WHERE status='open' FOR UPDATE");
 if(!cash.rowCount){await db.query("ROLLBACK");return Response.json({error:"Abra o caixa primeiro"},{status:422});}
 const entry=await db.query(`INSERT INTO financial_entries(cash_session_id,order_id,direction,category,amount_cents,description,created_by,idempotency_key)
 VALUES($1,$2,'in','order_payment',$3,$4,$5,$6) RETURNING *`,[cash.rows[0].id,id,parsed.data.amount_cents,parsed.data.method+(parsed.data.reference?": "+parsed.data.reference:""),c.userId,idem]);
 await db.query("UPDATE orders SET paid_cents=paid_cents+$2,updated_at=now(),version=version+1 WHERE id=$1",[id,parsed.data.amount_cents]);
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'payment_recorded','order',$2,$3::jsonb)",[c.userId,id,JSON.stringify({amount_cents:parsed.data.amount_cents,method:parsed.data.method})]);
 await db.query("COMMIT");return Response.json({entry:entry.rows[0],alreadyRecorded:false},{status:201});
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
