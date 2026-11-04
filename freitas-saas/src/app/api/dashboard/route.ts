import {context,errorResponse} from "@/lib/auth";
export async function GET(){
 try{
 const c=await context();
 const [orders,revenue,appointments,stock]=await Promise.all([
 c.db.query(`SELECT count(*)::int AS total,count(*) FILTER (WHERE status NOT IN ('DELIVERED','CANCELLED'))::int AS active,
 count(*) FILTER (WHERE status='READY')::int AS ready FROM orders`),
 c.db.query("SELECT COALESCE(sum(amount_cents) FILTER (WHERE direction='in' AND category='order_payment'),0)::bigint AS received_cents FROM financial_entries"),
 c.db.query("SELECT count(*)::int AS today FROM appointments WHERE starts_at>=date_trunc('day',now()) AND starts_at<date_trunc('day',now())+interval '1 day' AND status<>'cancelled'"),
 c.db.query("SELECT count(*)::int AS low_stock FROM stock_items WHERE quantity<=min_quantity")
 ]);
 return Response.json({...orders.rows[0],...revenue.rows[0],...appointments.rows[0],...stock.rows[0]});
 }catch(e){return errorResponse(e);}
}
