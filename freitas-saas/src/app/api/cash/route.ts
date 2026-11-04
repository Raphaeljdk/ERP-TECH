import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin} from "@/lib/security";
const amount=z.number().int().min(0).max(100000000);
const input=z.discriminatedUnion("action",[
 z.object({action:z.literal("open"),opening_cents:amount}).strict(),
 z.object({action:z.literal("close"),counted_cents:amount}).strict(),
 z.object({action:z.literal("entry"),direction:z.enum(["in","out"]),category:z.enum(["supply","withdrawal","expense","other"]),amount_cents:amount.min(1),description:z.string().trim().max(300).optional()}).strict()
]);
export async function GET(){
 try{
 const c=await context();authorize(c.role,["owner","manager","cashier"]);
 const s=await c.db.query("SELECT * FROM cash_sessions ORDER BY opened_at DESC LIMIT 12");
 const open=s.rows.find(v=>v.status==="open");
 const totals=open?await c.db.query("SELECT direction,COALESCE(SUM(amount_cents),0)::bigint AS cents FROM financial_entries WHERE cash_session_id=$1 GROUP BY direction",[open.id]):{rows:[]};
 return Response.json({sessions:s.rows,active:open||null,totals:totals.rows});
 }catch(e){return errorResponse(e);}
}
export async function POST(req:Request){
 try{
 sameOrigin(req);const c=await context();authorize(c.role,["owner","manager","cashier"]);
 const p=input.safeParse(await req.json());if(!p.success)return Response.json({error:"Operação de caixa inválida"},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 let row;
 if(p.data.action==="open"){
 const r=await db.query("INSERT INTO cash_sessions(opened_by,opening_cents) VALUES($1,$2) RETURNING *",[c.userId,p.data.opening_cents]);
 row=r.rows[0];
 }else{
 const open=await db.query("SELECT * FROM cash_sessions WHERE status='open' FOR UPDATE");
 if(!open.rowCount){await db.query("ROLLBACK");return Response.json({error:"Caixa não está aberto"},{status:422});}
 if(p.data.action==="close"){
 const r=await db.query("UPDATE cash_sessions SET status='closed',closed_at=now(),counted_cents=$2 WHERE id=$1 RETURNING *",[open.rows[0].id,p.data.counted_cents]);
 row=r.rows[0];
 }else{
 const r=await db.query("INSERT INTO financial_entries(cash_session_id,direction,category,amount_cents,description,created_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",[open.rows[0].id,p.data.direction,p.data.category,p.data.amount_cents,p.data.description||null,c.userId]);
 row=r.rows[0];
 }
 }
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,$2,'cash',$3,$4::jsonb)",[c.userId,p.data.action,row.id,JSON.stringify({action:p.data.action})]);
 await db.query("COMMIT");return Response.json(row,{status:201});
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
