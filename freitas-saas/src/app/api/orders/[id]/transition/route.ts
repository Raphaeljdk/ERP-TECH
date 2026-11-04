import {z} from "zod";
import {context,authorize,errorResponse} from "@/lib/auth";
import {sameOrigin,validId} from "@/lib/security";
import {canTransition} from "@/lib/workflow";
const input=z.object({to:z.enum(["INSPECTION","WASHING","QUALITY","READY","DELIVERED","CANCELLED"]),expected_version:z.number().int().min(1)}).strict();
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 try{
 sameOrigin(req);const {id}=await params;
 if(!validId(id))return Response.json({error:"Comanda inválida"},{status:400});
 const c=await context();authorize(c.role,["owner","manager","operator","inspector","cashier"]);
 const parsed=input.safeParse(await req.json());if(!parsed.success)return Response.json({error:"Transição inválida"},{status:400});
 const db=await c.db.connect();
 try{
 await db.query("BEGIN");
 const r=await db.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE",[id]);
 if(!r.rowCount){await db.query("ROLLBACK");return Response.json({error:"Não encontrado"},{status:404});}
 const o=r.rows[0];
 if(o.version!==parsed.data.expected_version){await db.query("ROLLBACK");return Response.json({error:"Comanda atualizada por outra pessoa. Atualize a tela."},{status:409});}
 if(!canTransition(o.status,parsed.data.to)){await db.query("ROLLBACK");return Response.json({error:"Etapa não permitida"},{status:422});}
 if(o.status==="INSPECTION"&&parsed.data.to==="WASHING"){
  const check=await db.query("SELECT 1 FROM inspections WHERE order_id=$1 AND status='completed'",[id]);
  if(!check.rowCount){await db.query("ROLLBACK");return Response.json({error:"Vistoria ainda não concluída"},{status:422});}
 }
 if(parsed.data.to==="DELIVERED"&&o.paid_cents<o.total_cents){
 await db.query("ROLLBACK");return Response.json({error:"Pagamento pendente"},{status:422});
 }
 if(parsed.data.to==="CANCELLED"&&o.paid_cents>0){
 await db.query("ROLLBACK");return Response.json({error:"Estorno deve ser conciliado antes de cancelar"},{status:422});
 }
 const closed=["DELIVERED","CANCELLED"].includes(parsed.data.to);
 const out=await db.query("UPDATE orders SET status=$2,version=version+1,updated_at=now(),closed_at=CASE WHEN $3 THEN now() ELSE NULL END WHERE id=$1 RETURNING *",[id,parsed.data.to,closed]);
 await db.query("INSERT INTO audit_events(actor_id,action,entity_type,entity_id,payload) VALUES($1,'status_change','order',$2,$3::jsonb)",[c.userId,id,JSON.stringify({from:o.status,to:parsed.data.to})]);
 await db.query("COMMIT");
 return Response.json(out.rows[0]);
 }catch(e){await db.query("ROLLBACK");throw e;}finally{db.release();}
 }catch(e){return errorResponse(e);}
}
