import {cookies} from "next/headers";
import {sessionCookie} from "@/lib/auth";
import {sameOrigin} from "@/lib/security";
export async function POST(request:Request){
 try{sameOrigin(request);const jar=await cookies();jar.delete(sessionCookie);return Response.json({ok:true});}
 catch{return Response.json({error:"Origem inválida"},{status:403});}
}
