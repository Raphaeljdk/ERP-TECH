"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {LayoutDashboard,ClipboardList,CalendarDays,Users,CarFront,Wrench,Package,Wallet,UserRound,ChartNoAxesColumn,ScanEye,Settings,Plus,Search,ArrowRight,RefreshCw,ShieldCheck,LogOut,Clock3,AlertTriangle,CircleDollarSign,X} from "lucide-react";
import InspectionWorkspace from "./inspection";
type R=Record<string,any>;
type Tab="dashboard"|"orders"|"appointments"|"customers"|"vehicles"|"services"|"stock_items"|"cash"|"staff"|"reports"|"inspection"|"settings";
const demo=process.env.NEXT_PUBLIC_DEMO_MODE==="true";
const id=(n:number)=>"00000000-0000-4000-8000-"+String(n).padStart(12,"0");
const now="2026-11-04T13:00:00.000Z";
const seed:Record<string,R[]>={
 customers:[{id:id(1),name:"Cliente Exemplo 01",phone:"(11) 90000-0001",email:"exemplo01@invalid.test",created_at:now},{id:id(2),name:"Cliente Exemplo 02",phone:"(11) 90000-0002",created_at:now},{id:id(3),name:"Cliente Exemplo 03",created_at:now}],
 vehicles:[{id:id(11),customer_id:id(1),plate:"TESTE01",brand:"Toyota",model:"Corolla",color:"Prata",created_at:now},{id:id(12),customer_id:id(2),plate:"TESTE02",brand:"Honda",model:"Civic",color:"Preto",created_at:now},{id:id(13),customer_id:id(3),plate:"TESTE03",brand:"Fiat",model:"Argo",color:"Branco",created_at:now}],
 services:[{id:id(21),name:"Lavagem completa",price_cents:8000,duration_minutes:70,active:true,created_at:now},{id:id(22),name:"Lavagem expressa",price_cents:4500,duration_minutes:35,active:true,created_at:now},{id:id(23),name:"Higienização interna",price_cents:14000,duration_minutes:120,active:true,created_at:now},{id:id(24),name:"Polimento técnico",price_cents:18000,duration_minutes:180,active:true,created_at:now}],
 orders:[{id:id(31),customer_id:id(1),vehicle_id:id(11),status:"INSPECTION",total_cents:8000,paid_cents:0,version:1,opened_at:now},{id:id(32),customer_id:id(2),vehicle_id:id(12),status:"WASHING",total_cents:4500,paid_cents:0,version:1,opened_at:now},{id:id(33),customer_id:id(3),vehicle_id:id(13),status:"AWAITING",total_cents:14000,paid_cents:0,version:1,opened_at:now},{id:id(34),customer_id:id(1),vehicle_id:id(11),status:"READY",total_cents:18000,paid_cents:18000,version:1,opened_at:now}],
 appointments:[{id:id(41),customer_id:id(1),vehicle_id:id(11),service_id:id(21),starts_at:"2026-11-04T14:00:00.000Z",ends_at:"2026-11-04T15:10:00.000Z",status:"confirmed",created_at:now}],
 staff:[{id:id(51),name:"Operador Exemplo",role:"operator",active:true,created_at:now},{id:id(52),name:"Vistoriador Exemplo",role:"inspector",active:true,created_at:now}],
 stock_items:[{id:id(61),name:"Shampoo automotivo",sku:"DEMO-SHP",quantity:12,min_quantity:5,cost_cents:2200,created_at:now},{id:id(62),name:"Cera líquida",sku:"DEMO-CER",quantity:3,min_quantity:5,cost_cents:3200,created_at:now}],
 inspections:[{id:id(71),order_id:id(31),status:"draft",marks:[{id:id(72),part:"Porta esquerda",kind:"scratch",severity:"low",coordinate_x:-1.06,coordinate_y:1.08,coordinate_z:0,notes:"Exemplo fictício",created_at:now}]}],
 cash_sessions:[{id:id(81),status:"open",opening_cents:20000,opened_at:now}],
 financial_entries:[{id:id(91),order_id:id(34),cash_session_id:id(81),direction:"in",category:"order_payment",amount_cents:18000,created_at:now}]
};
const navigation:{tab:Tab;label:string;icon:typeof LayoutDashboard}[]=[
 {tab:"dashboard",label:"Visão geral",icon:LayoutDashboard},
 {tab:"orders",label:"Comandas",icon:ClipboardList},
 {tab:"appointments",label:"Agendamentos",icon:CalendarDays},
 {tab:"customers",label:"Clientes",icon:Users},
 {tab:"vehicles",label:"Veículos",icon:CarFront},
 {tab:"services",label:"Serviços",icon:Wrench},
 {tab:"stock_items",label:"Estoque",icon:Package},
 {tab:"cash",label:"Caixa",icon:Wallet},
 {tab:"staff",label:"Equipe",icon:UserRound},
 {tab:"reports",label:"Relatórios",icon:ChartNoAxesColumn},
 {tab:"inspection",label:"Vistoria 3D",icon:ScanEye},
 {tab:"settings",label:"Configurações",icon:Settings}
];
const names:Record<Tab,string>={dashboard:"Visão geral",orders:"Comandas",appointments:"Agendamentos",customers:"Clientes",vehicles:"Veículos",services:"Serviços",stock_items:"Estoque",cash:"Caixa",staff:"Equipe",reports:"Relatórios",inspection:"Vistoria 3D",settings:"Configurações"};
const statusNames:Record<string,string>={AWAITING:"Aguardando",INSPECTION:"Em vistoria",WASHING:"Em lavagem",QUALITY:"Conferência",READY:"Pronta",DELIVERED:"Entregue",CANCELLED:"Cancelada",scheduled:"Agendado",confirmed:"Confirmado",arrived:"Chegou",done:"Concluído",cancelled:"Cancelado",open:"Aberto",closed:"Fechado"};
const nextStage:Record<string,string>={AWAITING:"INSPECTION",INSPECTION:"WASHING",WASHING:"QUALITY",QUALITY:"READY",READY:"DELIVERED"};
const fields:Record<string,{key:string;label:string;type?:string;list?:string}[]>={
 customers:[{key:"name",label:"Nome completo"},{key:"phone",label:"Telefone"},{key:"email",label:"E-mail"}],
 vehicles:[{key:"customer_id",label:"Cliente",list:"customers"},{key:"plate",label:"Placa"},{key:"brand",label:"Marca"},{key:"model",label:"Modelo"},{key:"color",label:"Cor"},{key:"year",label:"Ano",type:"number"}],
 services:[{key:"name",label:"Nome do serviço"},{key:"price_brl",label:"Preço (R$)",type:"number"},{key:"duration_minutes",label:"Duração em minutos",type:"number"}],
 appointments:[{key:"customer_id",label:"Cliente",list:"customers"},{key:"vehicle_id",label:"Veículo",list:"vehicles"},{key:"service_id",label:"Serviço",list:"services"},{key:"starts_at",label:"Início",type:"datetime-local"},{key:"ends_at",label:"Fim",type:"datetime-local"}],
 staff:[{key:"name",label:"Nome"},{key:"role",label:"Função",list:"roles"},{key:"email",label:"E-mail"}],
 stock_items:[{key:"name",label:"Nome do produto"},{key:"sku",label:"SKU"},{key:"quantity",label:"Quantidade",type:"number"},{key:"min_quantity",label:"Estoque mínimo",type:"number"},{key:"cost_brl",label:"Custo unitário (R$)",type:"number"}],
 orders:[{key:"customer_id",label:"Cliente",list:"customers"},{key:"vehicle_id",label:"Veículo",list:"vehicles"},{key:"service_id",label:"Serviço",list:"services"},{key:"notes",label:"Observações"}],
 stockmove:[{key:"delta",label:"Quantidade a movimentar (+ entrada / - saída)",type:"number"},{key:"reason",label:"Justificativa"}]
};
function money(cents:number|string|undefined){return ((Number(cents)||0)/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
function fmtDate(s:string|undefined){return s?new Date(s).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):"—";}
function sid(s:string){return s?"#"+s.slice(0,8).toUpperCase():"—";}
function statusClass(s:string){return "status "+s.toLowerCase();}
async function api(path:string,options?:RequestInit):Promise<any>{
 const res=await fetch(path,{credentials:"same-origin",cache:"no-store",...options,headers:{"Content-Type":"application/json",...(options?.headers||{})}});
 const body=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(body.error||"Falha na comunicação");
 return body;
}
export default function ERP(){
 const [tab,setTab]=useState<Tab>("dashboard");
 const [data,setData]=useState<Record<string,R[]>>(seed);
 const [initialized,setInitialized]=useState(false);
 const [profile,setProfile]=useState<R|null>(demo?{role:"owner",tenant:{name:"Empresa Demonstração"}}:null);
 const [loading,setLoading]=useState(!demo);
 const [login,setLogin]=useState({email:"",password:""});
 const [loginError,setLoginError]=useState("");
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const [modal,setModal]=useState<string|null>(null);
 const [form,setForm]=useState<Record<string,string>>({});
 const [search,setSearch]=useState("");
 const [activeOrder,setActiveOrder]=useState<string>(id(31));
 const [movingStock,setMovingStock]=useState<string>("");
 const [cashData,setCashData]=useState<R>({active:seed.cash_sessions[0],sessions:seed.cash_sessions,totals:[]});
 const [report,setReport]=useState<R|null>(null);
 const [saving,setSaving]=useState(false);
 const [backendStats,setBackendStats]=useState<R|null>(null);
 useEffect(()=>{
 if(demo){
  try{const saved=localStorage.getItem("freitas-erp-saas-demo-v01");if(saved){const parsed=JSON.parse(saved);if(parsed&&typeof parsed==="object"&&Array.isArray(parsed.orders))setData(parsed);}}catch{}
  setInitialized(true);return;
 }
 api("/api/auth/me").then(setProfile).catch(()=>setProfile(null)).finally(()=>{setLoading(false);setInitialized(true)});
 },[]);
 useEffect(()=>{if(demo&&initialized){try{localStorage.setItem("freitas-erp-saas-demo-v01",JSON.stringify(data));}catch{}}},[data,initialized]);
 const load=useCallback(async()=>{
 if(demo||!profile)return;
 try{
 const resources=["customers","vehicles","services","appointments","staff","stock_items"];
 const results=await Promise.all(resources.map(resource=>api("/api/resources/"+resource)));
 const [orders,cash,stats,reports]=await Promise.all([api("/api/orders"),api("/api/cash").catch(()=>({active:null,sessions:[]})),api("/api/dashboard"),api("/api/reports").catch(()=>null)]);
 setData(d=>({...d,...Object.fromEntries(resources.map((r,i)=>[r,results[i].items])),orders:orders.items}));
 setCashData(cash);setBackendStats(stats);setReport(reports);setError("");
 }catch(e){setError((e as Error).message);}
 },[profile]);
 useEffect(()=>{if(!demo&&profile)void load();},[load,profile]);
 useEffect(()=>{setSearch("");setError("");setNotice("");},[tab]);
 function row(resource:string,idValue:string){return (data[resource]||[]).find(r=>r.id===idValue);}
 function display(resource:string,idValue:string){const r=row(resource,idValue);return resource==="vehicles"?(r?r.plate+" · "+r.model:"—"):r?.name||"—";}
 function setResource(resource:string,items:R[]){setData(d=>({...d,[resource]:items}));}
 function demoInsert(resource:string,payload:R){
 const record={id:crypto.randomUUID(),created_at:new Date().toISOString(),...payload};
 setData(d=>({...d,[resource]:[record,...(d[resource]||[])]}));
 return record;
 }
 function openModal(name:string,extra?:string){setModal(name);setForm({});setMovingStock(extra||"");setError("");}
 function fieldOptions(key:string){
 if(key==="roles")return [{id:"manager",name:"Gerente"},{id:"cashier",name:"Caixa"},{id:"operator",name:"Operador"},{id:"inspector",name:"Vistoriador"},{id:"viewer",name:"Consulta"}];
 return (data[key]||[]).map(r=>({id:r.id,name:key==="vehicles"?r.plate+" · "+r.model:r.name}));
 }
 function payloadFromForm(resource:string){
 const p:R={};
 for(const field of fields[resource]||[]){
 const raw=(form[field.key]||"").trim();
 if(field.key==="price_brl"){p.price_cents=Math.round(Number(raw)*100);continue;}
 if(field.key==="cost_brl"){p.cost_cents=Math.round(Number(raw)*100);continue;}
 if(["starts_at","ends_at"].includes(field.key)){p[field.key]=new Date(raw).toISOString();continue;}
 if(["duration_minutes","year","quantity","min_quantity","delta"].includes(field.key)){p[field.key]=Number(raw);continue;}
 if(raw)p[field.key]=raw;
 }
 return p;
 }
 async function submit(){
 if(!modal)return;
 setSaving(true);setError("");
 try{
 const payload=payloadFromForm(modal);
 if(modal==="stockmove"){
  if(demo){
   const old=row("stock_items",movingStock);
   if(!old)throw new Error("Produto não encontrado");
   const qty=Number(old.quantity)+Number(payload.delta);
   if(!Number.isFinite(qty)||qty<0)throw new Error("Saldo insuficiente para retirada");
   setResource("stock_items",data.stock_items.map(x=>x.id===movingStock?{...x,quantity:qty}:x));
  }else{await api("/api/stock/move",{method:"POST",body:JSON.stringify({stock_item_id:movingStock,...payload})});await load();}
 }else if(modal==="orders"){
  const svc=row("services",payload.service_id);
  const v=row("vehicles",payload.vehicle_id);
  if(!svc||!v||v.customer_id!==payload.customer_id)throw new Error("Selecione um veículo que pertença ao cliente");
  if(demo){const created=demoInsert("orders",{customer_id:payload.customer_id,vehicle_id:payload.vehicle_id,total_cents:svc.price_cents,paid_cents:0,version:1,status:"AWAITING",notes:payload.notes,opened_at:new Date().toISOString()});setActiveOrder(created.id);}
  else{const created=await api("/api/orders",{method:"POST",body:JSON.stringify({customer_id:payload.customer_id,vehicle_id:payload.vehicle_id,items:[{service_id:payload.service_id,quantity:1}],notes:payload.notes})});setActiveOrder(created.id);await load();}
 }else{
  if(modal==="services"&&(!Number.isInteger(payload.price_cents)||payload.price_cents<0))throw new Error("Informe um preço válido");
  if(modal==="stock_items"&&(!Number.isInteger(payload.cost_cents)||payload.cost_cents<0))throw new Error("Informe um custo válido");
  if(demo)demoInsert(modal,payload);
  else{await api("/api/resources/"+modal,{method:"POST",body:JSON.stringify(payload)});await load();}
 }
 setModal(null);setNotice("Registro salvo com sucesso.");
 }catch(e){setError((e as Error).message);}finally{setSaving(false);}
 }
 async function transition(o:R){
 const to=nextStage[o.status];if(!to)return;
 setError("");
 try{
 if(demo)setResource("orders",data.orders.map(x=>x.id===o.id?{...x,status:to,version:x.version+1}:x));
 else{await api("/api/orders/"+o.id+"/transition",{method:"POST",body:JSON.stringify({to,expected_version:o.version})});await load();}
 setNotice("Etapa atualizada para "+statusNames[to]+".");
 }catch(e){setError((e as Error).message);}
 }
 async function receive(o:R){
 const remaining=Number(o.total_cents)-Number(o.paid_cents);
 if(remaining<=0)return;
 if(!window.confirm("Confirmar recebimento manual de "+money(remaining)+"? Isso não processa cartões ou Pix automaticamente."))return;
 try{
 if(demo){
  const cash=data.cash_sessions?.find(v=>v.status==="open");if(!cash)throw new Error("Abra o caixa antes de registrar pagamento");
  setData(d=>({...d,orders:d.orders.map(x=>x.id===o.id?{...x,paid_cents:Number(x.paid_cents)+remaining,version:x.version+1}:x),financial_entries:[{id:crypto.randomUUID(),cash_session_id:cash.id,order_id:o.id,direction:"in",category:"order_payment",amount_cents:remaining,created_at:new Date().toISOString()},...(d.financial_entries||[])]}));
 }else{
  await api("/api/orders/"+o.id+"/payment",{method:"POST",headers:{"Idempotency-Key":crypto.randomUUID().replaceAll("-","")},body:JSON.stringify({amount_cents:remaining,method:"cash"})});
  await load();
 }
 setNotice("Recebimento registrado no caixa.");
 }catch(e){setError((e as Error).message);}
 }
 async function cashAction(action:"open"|"close"){
 const raw=window.prompt(action==="open"?"Valor de abertura (R$)":"Valor contado para fechamento (R$)","0");
 if(raw===null)return;
 const amount=Math.round(Number(raw.replace(",","."))*100);
 if(!Number.isInteger(amount)||amount<0)return setError("Valor inválido");
 try{
 const payload=action==="open"?{action,opening_cents:amount}:{action,counted_cents:amount};
 if(demo){
  if(action==="open"){
   if(data.cash_sessions.some(v=>v.status==="open"))throw new Error("Já existe caixa aberto");
   setResource("cash_sessions",[{id:crypto.randomUUID(),opened_at:new Date().toISOString(),opening_cents:amount,status:"open"},...data.cash_sessions]);
  }else{
   if(!data.cash_sessions.some(v=>v.status==="open"))throw new Error("Nenhum caixa aberto");
   setResource("cash_sessions",data.cash_sessions.map(v=>v.status==="open"?{...v,status:"closed",counted_cents:amount,closed_at:new Date().toISOString()}:v));
  }
 }else{await api("/api/cash",{method:"POST",body:JSON.stringify(payload)});await load();}
 setNotice("Operação de caixa registrada.");
 }catch(e){setError((e as Error).message);}
 }
 function resetDemo(){if(!demo||!window.confirm("Restaurar somente dados fictícios deste navegador?"))return;setData(structuredClone(seed));setNotice("Demonstração restaurada.");}
 const rows=data.orders||[];
 const moneyReceived=demo?(data.financial_entries||[]).filter(v=>v.direction==="in"&&v.category==="order_payment").reduce((sum,v)=>sum+Number(v.amount_cents||0),0):Number(backendStats?.received_cents||0);
 const metrics=demo?{total:rows.length,active:rows.filter(o=>!["DELIVERED","CANCELLED"].includes(o.status)).length,ready:rows.filter(o=>o.status==="READY").length,today:(data.appointments||[]).length,low_stock:(data.stock_items||[]).filter(v=>Number(v.quantity)<=Number(v.min_quantity)).length}:backendStats||{total:0,active:0,ready:0,today:0,low_stock:0};
 const filtered=(data[tab]||[]).filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
 const orderFiltered=rows.filter(o=>(display("customers",o.customer_id)+" "+display("vehicles",o.vehicle_id)+" "+o.status).toLowerCase().includes(search.toLowerCase()));
 const headers:Record<string,{label:string;value:(r:R)=>React.ReactNode}[]>={
 customers:[{label:"Nome",value:r=><strong>{r.name}</strong>},{label:"Telefone",value:r=>r.phone||"—"},{label:"E-mail",value:r=>r.email||"—"}],
 vehicles:[{label:"Placa",value:r=><strong>{r.plate}</strong>},{label:"Veículo",value:r=>[r.brand,r.model].filter(Boolean).join(" ")},{label:"Cliente",value:r=>display("customers",r.customer_id)},{label:"Cor",value:r=>r.color||"—"}],
 services:[{label:"Serviço",value:r=><strong>{r.name}</strong>},{label:"Preço",value:r=>money(r.price_cents)},{label:"Duração",value:r=>r.duration_minutes+" min"},{label:"Disponível",value:r=><span className={statusClass(r.active===false?"cancelled":"active")}>{r.active===false?"Não":"Sim"}</span>}],
 appointments:[{label:"Cliente",value:r=><strong>{display("customers",r.customer_id)}</strong>},{label:"Veículo",value:r=>display("vehicles",r.vehicle_id)},{label:"Serviço",value:r=>display("services",r.service_id)},{label:"Início",value:r=>fmtDate(r.starts_at)},{label:"Status",value:r=><span className={statusClass(r.status)}>{statusNames[r.status]||r.status}</span>}],
 stock_items:[{label:"Produto",value:r=><strong>{r.name}</strong>},{label:"SKU",value:r=>r.sku||"—"},{label:"Quantidade",value:r=><span className={statusClass(Number(r.quantity)<=Number(r.min_quantity)?"cancelled":"active")}>{r.quantity}</span>},{label:"Mínimo",value:r=>r.min_quantity},{label:"Custo",value:r=>money(r.cost_cents)},{label:"Ação",value:r=><button className="btn small" onClick={()=>openModal("stockmove",r.id)}>Movimentar</button>}],
 staff:[{label:"Profissional",value:r=><strong>{r.name}</strong>},{label:"Função",value:r=>r.role},{label:"E-mail",value:r=>r.email||"—"},{label:"Ativo",value:r=>r.active===false?"Não":"Sim"}]
 };
 if(loading)return <main className="login-wrap"><div className="login-card">Verificando sessão segura…</div></main>;
 if(!profile&&!demo)return <main className="login-wrap"><div className="login-card"><div className="brand-symbol">F.</div><h1>Freitas ERP</h1><p>Ambiente de homologação com empresas isoladas e autenticação própria. Não utilize credenciais da Ducha Elitte.</p>{loginError&&<div className="feedback">{loginError}</div>}<form onSubmit={async e=>{e.preventDefault();setLoginError("");try{const user=await api("/api/auth/login",{method:"POST",body:JSON.stringify(login)});setProfile(user);}catch(err){setLoginError((err as Error).message);}}}><label className="field">E-mail<input type="email" required autoComplete="username" value={login.email} onChange={e=>setLogin(p=>({...p,email:e.target.value}))}/></label><label className="field">Senha<input type="password" required autoComplete="current-password" value={login.password} onChange={e=>setLogin(p=>({...p,password:e.target.value}))}/></label><button className="btn primary full" type="submit">Entrar com segurança</button></form><p>Primeiro acesso requer cadastro do administrador no banco de homologação.</p></div></main>;
 return <div className="shell"><aside className="sidebar"><div className="brand"><div className="brand-symbol">F.</div><div className="brand-copy"><strong>FREITAS <span>ERP</span></strong><small>GESTÃO AUTOMOTIVA</small></div></div><div className="nav-caption">WORKSPACE</div><nav className="nav" aria-label="Módulos do ERP">{navigation.map(item=>{const I=item.icon;return <button key={item.tab} className={"nav-button "+(tab===item.tab?"active":"")} onClick={()=>setTab(item.tab)}><I aria-hidden="true"/>{item.label}{item.tab==="orders"&&<span className="count">{metrics.active}</span>}</button>;})}</nav><div className="sidebar-footer"><div className="lab-box"><strong>{demo?"● TESTE COM DADOS FICTÍCIOS":"● AMBIENTE RESTRITO"}</strong><p>{demo?"Dados demonstrativos apenas neste navegador. Não utilize informações de clientes.":"Acesso autenticado por empresa. Cobranças online desabilitadas."}</p></div><span>Freitas Corp · Laboratório SaaS</span></div></aside>
 <section className="workspace"><header className="topbar"><div className="crumb">Freitas ERP / <strong>{names[tab]}</strong></div><div className="top-actions"><span className="pill">{demo?"DEMONSTRAÇÃO":"HOMOLOGAÇÃO"}</span><div className="avatar">FC</div>{!demo&&<button className="btn small ghost" onClick={async()=>{await api("/api/auth/logout",{method:"POST"});setProfile(null);}} aria-label="Sair"><LogOut size={16}/></button>}</div></header>
 <main className="main"><div className="header-row"><div><p className="eyebrow">PLATAFORMA OPERACIONAL · VERSÃO DE LABORATÓRIO</p><h1>{tab==="dashboard"?"Gestão inteligente, em um só lugar.":names[tab]}</h1><p>{tab==="dashboard"?"Acompanhe o fluxo do lava-rápido com dados de demonstração.":tab==="inspection"?"Inspeção visual vinculada à comanda, com histórico e marcações.":"Gerencie sua operação com praticidade e controle."}</p></div>{fields[tab]&&<button className="btn primary" onClick={()=>openModal(tab)}><Plus size={16}/>Novo registro</button>}</div>
 {error&&<div className="notice warning" role="alert">{error} <button className="btn small ghost" onClick={()=>setError("")}>Fechar</button></div>}
 {notice&&<div className="notice" role="status">{notice}</div>}
 {tab==="dashboard"&&<><div className="hero"><div className="hero-content"><p className="eyebrow">NOVA EXPERIÊNCIA DE ATENDIMENTO</p><h2>Comandas organizadas.<br/><em>Vistoria visual em 3D.</em></h2><p>Recepção, inspeção, lavagem, conferência e entrega, em um único fluxo.</p><button className="btn primary" onClick={()=>setTab("inspection")}><ScanEye size={15}/>Explorar vistoria <ArrowRight size={15}/></button></div><span className="hero-icon" aria-hidden="true">🚘</span></div><div className="stats">
 <div className="stat"><span className="stat-label"><ClipboardList/> Comandas</span><strong>{metrics.total}</strong><small>Atendimentos registrados</small></div>
 <div className="stat"><span className="stat-label"><Clock3/> Em andamento</span><strong>{metrics.active}</strong><small>{metrics.ready} aguardando entrega</small></div>
 <div className="stat"><span className="stat-label"><CircleDollarSign/> Recebido</span><strong>{money(moneyReceived)}</strong><small>Registros de recebimento, não previsão</small></div>
 <div className="stat"><span className="stat-label"><AlertTriangle/> Estoque baixo</span><strong>{metrics.low_stock}</strong><small>Produtos no limite de reposição</small></div></div>
 <div className="grid-two"><div className="panel"><div className="panel-head"><div><h3>Comandas recentes</h3><p>Selecione uma comanda para abrir a vistoria</p></div><button className="btn small ghost" onClick={()=>setTab("orders")}>Ver todas</button></div><div className="table-wrap"><table><thead><tr><th>Comanda</th><th>Veículo</th><th>Valor</th><th>Status</th></tr></thead><tbody>{rows.slice(0,5).map(o=><tr key={o.id} style={{cursor:"pointer"}} onClick={()=>{setActiveOrder(o.id);setTab("inspection");}}><td><strong>{sid(o.id)}</strong></td><td>{display("vehicles",o.vehicle_id)}</td><td>{money(o.total_cents)}</td><td><span className={statusClass(o.status)}>{statusNames[o.status]||o.status}</span></td></tr>)}</tbody></table></div></div><div className="panel"><div className="panel-head"><div><h3>Resumo da operação</h3><p>Etapas das comandas atuais</p></div></div><div className="quick-list">{["AWAITING","INSPECTION","WASHING","QUALITY","READY"].map(s=><div className="quick" key={s}><div><strong>{statusNames[s]}</strong><small>{rows.filter(o=>o.status===s).length} atendimentos</small></div><div className="quick-dot"/></div>)}<div className="quick"><div><strong>Agendamentos</strong><small>{metrics.today} registros</small></div><CalendarDays size={18}/></div></div></div></div></>}
 {tab==="orders"&&<><div className="data-top"><input className="search" aria-label="Buscar comandas" placeholder="Buscar cliente, placa ou status..." value={search} onChange={e=>setSearch(e.target.value)}/><button className="btn ghost" onClick={()=>{void load();}}><RefreshCw size={15}/>Atualizar</button></div><div className="panel table-wrap"><table><thead><tr><th>Comanda</th><th>Cliente e veículo</th><th>Total</th><th>Recebido</th><th>Etapa</th><th>Operações</th></tr></thead><tbody>{orderFiltered.map(o=><tr key={o.id}><td><strong>{sid(o.id)}</strong></td><td><strong>{display("customers",o.customer_id)}</strong><div style={{marginTop:4}}>{display("vehicles",o.vehicle_id)}</div></td><td>{money(o.total_cents)}</td><td>{money(o.paid_cents)}</td><td><span className={statusClass(o.status)}>{statusNames[o.status]||o.status}</span></td><td><div style={{display:"flex",gap:6}}><button className="btn small" onClick={()=>{setActiveOrder(o.id);setTab("inspection");}}>Vistoria</button>{nextStage[o.status]&&<button className="btn small" onClick={()=>void transition(o)}>{statusNames[nextStage[o.status]]}</button>}{Number(o.paid_cents)<Number(o.total_cents)&&!["CANCELLED","DELIVERED"].includes(o.status)&&<button className="btn small primary" onClick={()=>void receive(o)}>Receber</button>}</div></td></tr>)}</tbody></table>{!orderFiltered.length&&<div className="empty">Nenhuma comanda encontrada.</div>}</div></>}
 {headers[tab]&&<><div className="data-top"><input className="search" aria-label={"Buscar "+names[tab]} placeholder={"Buscar em "+names[tab].toLowerCase()+"..."} value={search} onChange={e=>setSearch(e.target.value)}/><button className="btn ghost" onClick={()=>void load()}><RefreshCw size={15}/>Atualizar</button></div><div className="panel table-wrap"><table><thead><tr>{headers[tab].map(h=><th key={h.label}>{h.label}</th>)}</tr></thead><tbody>{filtered.map(r=><tr key={r.id}>{headers[tab].map((h,i)=><td key={i}>{h.value(r)}</td>)}</tr>)}</tbody></table>{!filtered.length&&<div className="empty">Nenhum registro encontrado. Use “Novo registro” para começar.</div>}</div></>}
 {tab==="cash"&&<><div className="stats"><div className="stat"><span className="stat-label"><Wallet/> Situação do caixa</span><strong style={{fontSize:20}}>{(demo?data.cash_sessions:cashData.sessions||[]).some((v:R)=>v.status==="open")?"Aberto":"Fechado"}</strong><small>Controle de abertura e fechamento</small></div><div className="stat"><span className="stat-label"><CircleDollarSign/> Recebimentos</span><strong>{money(moneyReceived)}</strong><small>Somente recebimentos registrados</small></div></div><div className="panel"><div className="panel-head"><div><h3>Sessões de caixa</h3><p>Registros financeiros demonstrativos ou homologados</p></div><div style={{display:"flex",gap:7}}><button className="btn" onClick={()=>void cashAction("open")}>Abrir caixa</button><button className="btn" onClick={()=>void cashAction("close")}>Fechar caixa</button></div></div><div className="table-wrap"><table><thead><tr><th>Sessão</th><th>Abertura</th><th>Saldo inicial</th><th>Status</th></tr></thead><tbody>{(demo?data.cash_sessions:cashData.sessions||[]).map((v:R)=><tr key={v.id}><td><strong>{sid(v.id)}</strong></td><td>{fmtDate(v.opened_at)}</td><td>{money(v.opening_cents)}</td><td><span className={statusClass(v.status)}>{statusNames[v.status]}</span></td></tr>)}</tbody></table></div></div></>}
 {tab==="reports"&&<><div className="notice">Faturamento previsto e recebido são indicadores distintos. Este relatório considera apenas entradas registradas no caixa; não substitui a contabilidade fiscal.</div><div className="stats"><div className="stat"><span className="stat-label"><ClipboardList/> Comandas</span><strong>{metrics.total}</strong></div><div className="stat"><span className="stat-label"><CircleDollarSign/> Total recebido</span><strong>{money(moneyReceived)}</strong></div><div className="stat"><span className="stat-label"><Package/> Abaixo do mínimo</span><strong>{metrics.low_stock}</strong></div></div><div className="panel"><div className="panel-head"><div><h3>Movimentações financeiras</h3><p>Entradas e saídas do caixa</p></div></div><div className="table-wrap"><table><thead><tr><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Data</th></tr></thead><tbody>{(demo?(data.financial_entries||[]):report?.items||[]).map((v:R,i:number)=><tr key={v.id||i}><td>{v.category}</td><td>{v.direction==="in"?"Entrada":"Saída"}</td><td>{money(v.amount_cents??v.cents)}</td><td>{fmtDate(v.created_at)||"Hoje"}</td></tr>)}</tbody></table></div></div></>}
 {tab==="inspection"&&<InspectionWorkspace demo={demo} orders={rows} customers={data.customers||[]} vehicles={data.vehicles||[]} activeOrder={activeOrder} setActiveOrder={setActiveOrder} inspections={data.inspections||[]} setInspections={next=>setResource("inspections",next)} onError={setError} onNotice={setNotice}/>}
 {tab==="settings"&&<div className="grid-two"><div className="panel"><div className="panel-head"><div><h3>Empresa e segurança</h3><p>{profile?.tenant?.name||"Empresa Demonstração"}</p></div><ShieldCheck size={20}/></div><div style={{padding:21}}><p className="notice">Os dados operacionais de uma empresa ficam em banco exclusivo, enquanto o banco central mantém apenas acessos e configuração. Credenciais não são armazenadas no navegador.</p><div className="quick"><strong>Perfil atual</strong><span>{profile?.role}</span></div><div className="quick"><strong>Modo atual</strong><span>{demo?"Demonstração local":"Homologação autenticada"}</span></div><div className="quick"><strong>Pagamentos online</strong><span>Desativados</span></div>{demo&&<button className="btn danger" style={{marginTop:20}} onClick={resetDemo}>Restaurar dados demonstrativos</button>}</div></div><div className="panel"><div className="panel-head"><div><h3>Próximas integrações</h3><p>Dependem de homologação e credenciais exclusivas</p></div></div><div className="quick-list">{["Evidências fotográficas criptografadas","Assinatura do cliente e PDF","Provisionamento automático de empresas","Cobrança de assinaturas em ambiente de testes","Monitoramento e backups restauráveis"].map(s=><div className="quick" key={s}><strong>{s}</strong><span className="section-badge">Pendente</span></div>)}</div></div></div>}
 </main></section>
 {modal&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null);}}><div className="modal" role="dialog" aria-modal="true" aria-label="Novo registro"><div className="modal-head"><div><h2>{modal==="stockmove"?"Movimentar estoque":modal==="orders"?"Nova comanda":"Novo registro · "+names[modal as Tab]}</h2><p>Preencha os campos para continuar. {demo?"Somente dados fictícios.":""}</p></div><button className="btn ghost small" onClick={()=>setModal(null)} aria-label="Fechar"><X size={16}/></button></div><form onSubmit={e=>{e.preventDefault();void submit();}}><div className="form-grid">{(fields[modal]||[]).map(field=><label key={field.key} className={"field "+(field.key==="notes"?"wide":"")}>{field.label}{field.list?<select required value={form[field.key]||""} onChange={e=>setForm(p=>({...p,[field.key]:e.target.value}))}><option value="">Selecione</option>{fieldOptions(field.list).map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select>:<input required={!["phone","email","brand","color","year","notes","sku"].includes(field.key)} type={field.type||"text"} step={field.type==="number"?"any":undefined} value={form[field.key]||""} onChange={e=>setForm(p=>({...p,[field.key]:e.target.value}))}/>}</label>)}</div>{error&&<div className="feedback">{error}</div>}<div className="actions"><button type="button" className="btn ghost" onClick={()=>setModal(null)}>Cancelar</button><button className="btn primary" type="submit" disabled={saving}>{saving?"Salvando…":"Salvar registro"}</button></div></form></div></div>}
 </div>;
}
