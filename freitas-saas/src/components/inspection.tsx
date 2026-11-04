"use client";
import {useEffect,useRef,useState} from "react";
import {ScanEye,RotateCcw,Plus,CheckCircle2,ClipboardCheck,Camera,AlertTriangle} from "lucide-react";
type R=Record<string,any>;
const parts=["Capô","Para-choque dianteiro","Para-choque traseiro","Porta esquerda","Porta direita","Teto","Porta-malas","Vidro dianteiro","Vidro traseiro","Roda dianteira","Roda traseira"];
const checklistLabels:Record<string,string>={body:"Pintura e lataria",glass:"Vidros e faróis",wheels:"Rodas e pneus",interior:"Interior e objetos",customerAcknowledged:"Conferência com o cliente"};
function Car3D({marks,onPick}:{marks:R[];onPick:(part:string,position:[number,number,number])=>void}){
 const host=useRef<HTMLDivElement>(null);
 const pick=useRef(onPick);
 const updateMarks=useRef<((marks:R[])=>void)|null>(null);
 const reset=useRef<(()=>void)|null>(null);
 const [error,setError]=useState("");
 const [ready,setReady]=useState(false);
 useEffect(()=>{pick.current=onPick},[onPick]);
 useEffect(()=>{updateMarks.current?.(marks)},[marks]);
 useEffect(()=>{
 const target=host.current;if(!target)return;
 let alive=true;let cleanup:()=>void=()=>{};
 (async()=>{
 try{
 const THREE=await import("three");
 const {OrbitControls}=await import("three/addons/controls/OrbitControls.js");
 if(!alive)return;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(43,1,.1,100);
 camera.position.set(5,3.4,6.5);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.shadowMap.enabled=true;
 renderer.setClearColor(0x0b1a27,1);
 target.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.target.set(0,1,0);controls.enableDamping=true;controls.maxPolarAngle=Math.PI/2.0;controls.enablePan=false;controls.minDistance=3.3;controls.maxDistance=13;controls.update();
 const ambient=new THREE.HemisphereLight(0xe1f9ff,0x204053,2.7);scene.add(ambient);
 const sun=new THREE.DirectionalLight(0xffffff,3.2);sun.position.set(4,8,6);scene.add(sun);
 const floor=new THREE.GridHelper(10,20,0x286b73,0x1c3e51);floor.position.y=.06;scene.add(floor);
 const paint=new THREE.MeshPhysicalMaterial({color:0xb3d7e4,metalness:.58,roughness:.24,clearcoat:.9});
 const dark=new THREE.MeshStandardMaterial({color:0x182736,metalness:.2,roughness:.48});
 const glass=new THREE.MeshPhysicalMaterial({color:0x36718c,transparent:true,opacity:.9,metalness:.4,roughness:.12});
 const rim=new THREE.MeshStandardMaterial({color:0xb6d3d8,metalness:.8,roughness:.3});
 const vehicle=new THREE.Group();scene.add(vehicle);
 const clickable:import("three").Object3D[]=[];
 const makeBox=(w:number,h:number,d:number,x:number,y:number,z:number,part?:string,mat=paint)=>{
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);
 if(part){m.userData.part=part;clickable.push(m)}vehicle.add(m);return m;};
 makeBox(1.98,.53,4.55,0,.85,0);
 makeBox(1.85,.14,1.38,0,1.14,-1.56,"Capô");
 makeBox(1.83,.13,.8,0,1.13,1.84,"Porta-malas");
 makeBox(1.75,.13,1.88,0,1.76,.08,"Teto");
 makeBox(1.86,.2,.14,0,.63,-2.33,"Para-choque dianteiro",dark);
 makeBox(1.86,.2,.14,0,.63,2.33,"Para-choque traseiro",dark);
 makeBox(1.62,.58,.86,0,1.42,-.65,"Vidro dianteiro",glass);
 makeBox(1.61,.58,.82,0,1.42,.80,"Vidro traseiro",glass);
 for(const s of [-1,1]){
  makeBox(.04,.48,1.60,s*.99,1.07,.06,s===-1?"Porta esquerda":"Porta direita");
  for(const z of [-1.51,1.51]){
   const tire=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.22,30),dark);
   tire.rotation.z=Math.PI/2;tire.position.set(s*1.03,.53,z);
   tire.userData.part=z<0?"Roda dianteira":"Roda traseira";vehicle.add(tire);clickable.push(tire);
   const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.255,.255,.23,24),rim);wheel.rotation.z=Math.PI/2;wheel.position.copy(tire.position);vehicle.add(wheel);
  }
  makeBox(.26,.14,.16,s*.72,.96,-2.30,undefined,glass);
  makeBox(.25,.13,.13,s*.72,.95,2.3,undefined,dark);
 }
 let markerGroup=new THREE.Group();vehicle.add(markerGroup);
 function setMarkers(list:R[]){
  vehicle.remove(markerGroup);markerGroup.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as import("three").Material).dispose();}});
  markerGroup=new THREE.Group();
  for(const mark of list){
   if(mark.retracted_at)continue;
   const x=Number(mark.coordinate_x),y=Number(mark.coordinate_y),z=Number(mark.coordinate_z);
   if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(z))continue;
   const color=mark.severity==="high"?0xf06477:mark.severity==="medium"?0xffc56d:0x60f6c8;
   const orb=new THREE.Mesh(new THREE.SphereGeometry(.105,14,14),new THREE.MeshBasicMaterial({color,depthTest:false}));
   orb.position.set(x,y,z);orb.renderOrder=10;markerGroup.add(orb);
  }
  vehicle.add(markerGroup);
 }
 updateMarks.current=setMarkers;setMarkers(marks);
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
 let down:{x:number;y:number}|null=null;
 const onDown=(ev:PointerEvent)=>{down={x:ev.clientX,y:ev.clientY};};
 const onUp=(ev:PointerEvent)=>{
 if(!down||Math.hypot(ev.clientX-down.x,ev.clientY-down.y)>8)return;
 const rect=renderer.domElement.getBoundingClientRect();
 if(rect.width===0||rect.height===0)return;
 pointer.set((ev.clientX-rect.left)/rect.width*2-1,-(ev.clientY-rect.top)/rect.height*2+1);
 ray.setFromCamera(pointer,camera);
 const hit=ray.intersectObjects(clickable)[0];
 if(hit?.object.userData.part){
  const v=hit.point;
  pick.current(String(hit.object.userData.part),[Number(v.x.toFixed(3)),Number(v.y.toFixed(3)),Number(v.z.toFixed(3))]);
 }
 };
 renderer.domElement.addEventListener("pointerdown",onDown);
 renderer.domElement.addEventListener("pointerup",onUp);
 function resize(){if(!target)return;const width=Math.max(target.clientWidth,1),height=Math.max(target.clientHeight,1);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(target);resize();
 reset.current=()=>{camera.position.set(5,3.4,6.5);controls.target.set(0,1,0);controls.update();};
 let frame=0;const tick=()=>{frame=requestAnimationFrame(tick);controls.update();renderer.render(scene,camera);};tick();
 setReady(true);
 cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener("pointerdown",onDown);renderer.domElement.removeEventListener("pointerup",onUp);controls.dispose();scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}});renderer.dispose();if(renderer.domElement.parentNode===target)target.removeChild(renderer.domElement);updateMarks.current=null;reset.current=null;};
 }catch(e){if(alive)setError("Visualização 3D indisponível neste dispositivo. Use a lista de peças.");}
 })();
 return()=>{alive=false;cleanup();};
 // Monta uma única cena; atualizações das marcações usam updateMarks.current.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 return <><div ref={host} className="viewer">{!ready&&<div className="fallback">{error||"Carregando modelo automotivo 3D…"}</div>}</div><div className="tag-row"><button className="tag" onClick={()=>reset.current?.()}><RotateCcw size={12}/> Centralizar</button><span className="tag">{ready?"Arraste para girar, clique para marcar":"Alternativa: selecione a peça abaixo"}</span></div></>;
}
export default function InspectionWorkspace({demo,orders,customers,vehicles,activeOrder,setActiveOrder,inspections,setInspections,onError,onNotice}:{demo:boolean;orders:R[];customers:R[];vehicles:R[];activeOrder:string;setActiveOrder:(id:string)=>void;inspections:R[];setInspections:(next:R[])=>void;onError:(message:string)=>void;onNotice:(message:string)=>void}){
 const [inspection,setInspection]=useState<R|null>(null);
 const [selected,setSelected]=useState("Capô");
 const [point,setPoint]=useState<[number,number,number]|null>(null);
 const [kind,setKind]=useState("scratch");
 const [severity,setSeverity]=useState("low");
 const [note,setNote]=useState("");
 const [checks,setChecks]=useState<Record<string,boolean>>({body:false,glass:false,wheels:false,interior:false,customerAcknowledged:false});
 const [busy,setBusy]=useState(false);
 const order=orders.find(o=>o.id===activeOrder)||orders[0];
 const orderId=order?.id;
 const vehicle=vehicles.find(v=>v.id===order?.vehicle_id);
 const customer=customers.find(v=>v.id===order?.customer_id);
 const refresh=async()=>{
 if(!orderId){setInspection(null);return;}
 if(demo){
  const value=inspections.find(v=>v.order_id===orderId)||null;
  setInspection(value);
  if(value?.checklist)setChecks(value.checklist);
  return;
 }
 try{
 const r=await fetch("/api/inspections?order_id="+encodeURIComponent(orderId),{credentials:"same-origin",cache:"no-store"});
 const j=await r.json();
 if(!r.ok)throw new Error(j.error||"Não foi possível carregar vistoria");
 setInspection(j.inspection||null);
 if(j.inspection?.checklist)setChecks(j.inspection.checklist);
 }catch(e){onError((e as Error).message);}
 };
 useEffect(()=>{void refresh();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[orderId,inspections,demo]);
 function saveLocal(next:R){setInspection(next);setInspections(inspections.some(v=>v.id===next.id)?inspections.map(v=>v.id===next.id?next:v):[next,...inspections]);}
 async function createInspection(){
 if(!orderId)return;
 setBusy(true);
 try{
 if(demo){saveLocal({id:crypto.randomUUID(),order_id:orderId,model_version:"procedural-v1",status:"draft",marks:[],checklist:{}});}
 else{
 const r=await fetch("/api/inspections",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_id:orderId})});
 const j=await r.json();if(!r.ok)throw new Error(j.error||"Falha na vistoria");await refresh();
 }
 onNotice("Vistoria iniciada.");
 }catch(e){onError((e as Error).message);}finally{setBusy(false);}
 }
 async function register(){
 if(!inspection||inspection.status==="completed")return;
 setBusy(true);
 const payload={part:selected,kind,severity,notes:note,position:point||undefined};
 try{
 if(demo){saveLocal({...inspection,marks:[...(inspection.marks||[]),{id:crypto.randomUUID(),...payload,coordinate_x:point?.[0]??null,coordinate_y:point?.[1]??null,coordinate_z:point?.[2]??null,created_at:new Date().toISOString()}]});}
 else{
 const r=await fetch("/api/inspections/"+inspection.id+"/marks",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
 const j=await r.json();if(!r.ok)throw new Error(j.error||"Falha ao salvar marcação");await refresh();
 }
 setNote("");onNotice("Ocorrência registrada na vistoria.");
 }catch(e){onError((e as Error).message);}finally{setBusy(false);}
 }
 async function complete(){
 if(!inspection||!Object.values(checks).every(Boolean)||Object.keys(checks).length!==5){onError("Marque todos os itens do checklist antes de concluir.");return;}
 if(!window.confirm("Concluir vistoria? Novas alterações exigirão processo de correção auditável."))return;
 setBusy(true);
 try{
 if(demo)saveLocal({...inspection,status:"completed",checklist:checks,completed_at:new Date().toISOString()});
 else{
 const r=await fetch("/api/inspections/"+inspection.id,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({checklist:checks})});
 const j=await r.json();if(!r.ok)throw new Error(j.error||"Falha ao concluir vistoria");await refresh();
 }
 onNotice("Vistoria concluída com checklist completo.");
 }catch(e){onError((e as Error).message);}finally{setBusy(false);}
 }
 return <><div className="notice">Modelo 3D genérico e estilizado, para registro operacional. Não equivale a laudo técnico ou avaliação automática de danos. Fotos e assinaturas digitais exigem armazenamento e homologação adicionais.</div><div className="panel" style={{padding:18,marginBottom:18}}><div className="form-grid"><label className="field">Comanda<select value={orderId||""} onChange={e=>{setActiveOrder(e.target.value);setPoint(null);}}>{orders.map(o=><option key={o.id} value={o.id}>{o.id.slice(0,8).toUpperCase()} · {vehicles.find(v=>v.id===o.vehicle_id)?.plate||"Veículo"} · {o.status}</option>)}</select></label><div className="field">Atendimento<div className="section-badge" style={{minHeight:40}}>{customer?.name||"Nenhuma comanda"} · {vehicle?.model||"—"} / {vehicle?.plate||"—"}</div></div></div></div>
 <div className="split"><div className="panel" style={{padding:18}}><div className="panel-head" style={{padding:0,marginBottom:13}}><div><h3>Modelo interativo</h3><p>Selecione a região diretamente sobre o veículo</p></div><ScanEye size={18}/></div><Car3D marks={inspection?.marks||[]} onPick={(p,pos)=>{setSelected(p);setPoint(pos);}}/><div className="tag-row">{parts.map(p=><button key={p} className={"tag "+(p===selected?"selected":"")} onClick={()=>{setSelected(p);setPoint(null);}}>{p}</button>)}</div></div>
 <div style={{display:"flex",flexDirection:"column",gap:16}}><div className="panel" style={{padding:20}}><div className="panel-head" style={{padding:0,marginBottom:17}}><div><h3>Ocorrências</h3><p>Marcas, gravidade e observações</p></div><span className="section-badge">{(inspection?.marks||[]).filter((v:R)=>!v.retracted_at).length}</span></div>
 {!inspection?<><p className="notice">Esta comanda ainda não possui vistoria.</p><button className="btn primary full" disabled={!order||busy||!["AWAITING","INSPECTION"].includes(order.status)} onClick={()=>void createInspection()}>Iniciar vistoria</button></>:<><div className="form-grid"><label className="field">Peça<input value={selected} readOnly/></label><label className="field">Tipo de ocorrência<select value={kind} onChange={e=>setKind(e.target.value)}><option value="scratch">Risco</option><option value="dent">Amassado</option><option value="crack">Trinca</option><option value="broken">Dano</option><option value="dirt">Sujeira</option><option value="other">Outro</option></select></label><label className="field">Gravidade<select value={severity} onChange={e=>setSeverity(e.target.value)}><option value="low">Leve</option><option value="medium">Moderada</option><option value="high">Grave</option></select></label><label className="field wide">Observações<textarea value={note} onChange={e=>setNote(e.target.value)} maxLength={1000} placeholder="Descreva o que foi observado"/></label></div><button className="btn primary full" style={{marginTop:15}} disabled={busy||inspection.status==="completed"} onClick={()=>void register()}><Plus size={16}/>Registrar ocorrência</button><div className="marker-list">{(inspection.marks||[]).filter((m:R)=>!m.retracted_at).map((m:R)=><div key={m.id} className="marker"><strong>{m.part} · {m.kind}</strong><small>Gravidade: {m.severity} · {m.notes||"Sem descrição"}</small></div>)}</div>{inspection.status==="completed"&&<span className="pill">VISTORIA CONCLUÍDA</span>}</>}
 </div><div className="panel" style={{padding:20}}><div className="panel-head" style={{padding:0,marginBottom:14}}><div><h3>Checklist de entrega</h3><p>Verificações manuais obrigatórias</p></div><ClipboardCheck size={18}/></div>{Object.entries(checklistLabels).map(([key,label])=><label key={key} style={{display:"flex",alignItems:"center",gap:9,marginBottom:13,fontSize:12,color:"#bad1dc"}}><input type="checkbox" checked={Boolean(checks[key])} disabled={!inspection||inspection.status==="completed"} onChange={e=>setChecks(p=>({...p,[key]:e.target.checked}))}/>{label}</label>)}<button className="btn full" onClick={()=>void complete()} disabled={!inspection||inspection.status==="completed"||busy}><CheckCircle2 size={15}/>Concluir vistoria</button></div>
 <div className="panel" style={{padding:18}}><div style={{display:"flex",gap:9,alignItems:"center"}}><Camera size={18} color="#8aa6b5"/><strong style={{fontSize:12}}>Evidências fotográficas</strong></div><p style={{fontSize:11,color:"#90aabb",lineHeight:1.65}}>Upload, carimbo de tempo, arquivos originais, assinatura e PDF serão liberados somente com storage privado e auditoria homologados.</p><span className="section-badge">Ainda indisponível</span></div></div></div></>;
}
