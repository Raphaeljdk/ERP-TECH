import {context,authorize,errorResponse} from "@/lib/auth";
export async function GET(req:Request){
 try{
 const c=await context();authorize(c.role,["owner","manager","cashier"]);
 const u=new URL(req.url);
 const d=u.searchParams.get("date");
 if(d&&!/^\d{4}-\d{2}-\d{2}$/.test(d))return Response.json({error:"Data inválida"},{status:400});
 const date=d||new Date().toISOString().slice(0,10);
 const rows=await c.db.query(`SELECT direction,category,count(*)::int AS entries,COALESCE(sum(amount_cents),0)::bigint AS cents
 FROM financial_entries WHERE created_at>=$1::date AND created_at<$1::date+interval '1 day'
 GROUP BY direction,category ORDER BY direction,category`,[date]);
 return Response.json({date,items:rows.rows,note:"Somente registros financeiros, não valores previstos"});
 }catch(e){return errorResponse(e);}
}
