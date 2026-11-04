import {AuthError} from "./auth";
export function sameOrigin(request:Request){
 const origin=request.headers.get("origin");
 if(!origin||origin!==new URL(request.url).origin)throw new AuthError(403,"Origem da requisição inválida");
}
export function validId(value:string):boolean{return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)}
export function validationError(error:unknown):Response{
 return Response.json({error:"Dados inválidos",details:error instanceof Error?error.message:undefined},{status:400});
}
