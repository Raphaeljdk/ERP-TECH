export const transitions:Record<string,string[]>={
 AWAITING:["INSPECTION","CANCELLED"],
 INSPECTION:["WASHING","CANCELLED"],
 WASHING:["QUALITY","CANCELLED"],
 QUALITY:["READY","WASHING","CANCELLED"],
 READY:["DELIVERED","CANCELLED"],
 DELIVERED:[],CANCELLED:[]
};
export function canTransition(from:string,to:string):boolean{return (transitions[from]||[]).includes(to);}
