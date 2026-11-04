/* Freitas ERP Lab — carro 3D procedural, sem dependência de modelos proprietários. */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const holder=document.getElementById("vehicle-viewer");
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(40,1,0.1,100);
camera.position.set(6,4.1,7);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.4;
holder.innerHTML="";
holder.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.target.set(0,0.8,0);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=4;controls.maxDistance=12;controls.maxPolarAngle=Math.PI/2.02;controls.enablePan=false;controls.update();
scene.add(new THREE.HemisphereLight(0xd0f9ff,0x293453,3.1));
const sun=new THREE.DirectionalLight(0xffffff,3.3);sun.position.set(-4,10,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8;scene.add(sun);
const lamp=new THREE.DirectionalLight(0x72dff3,2.2);lamp.position.set(5,4,-6);scene.add(lamp);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.24}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=.04;scene.add(floor);
const grid=new THREE.GridHelper(12,18,0x37627c,0x28435c);grid.position.y=.025;grid.material.opacity=.25;grid.material.transparent=true;scene.add(grid);
const car=new THREE.Group();scene.add(car);
const paint=new THREE.MeshPhysicalMaterial({color:0xb5d7e9,metalness:.58,roughness:.24,clearcoat:.9,clearcoatRoughness:.13});
const dark=new THREE.MeshStandardMaterial({color:0x152032,metalness:.35,roughness:.46});
const glass=new THREE.MeshPhysicalMaterial({color:0x234860,metalness:.34,roughness:.08,transparent:true,opacity:.89,side:THREE.DoubleSide});
const chrome=new THREE.MeshStandardMaterial({color:0xd8e8ef,metalness:.87,roughness:.18});
const light=new THREE.MeshStandardMaterial({color:0xe0f9ff,emissive:0x9feeff,emissiveIntensity:.7});
const red=new THREE.MeshStandardMaterial({color:0xe9486c,emissive:0x7f1330,emissiveIntensity:.6});
const selectionMat=new THREE.MeshBasicMaterial({color:0x70ffda,transparent:true,opacity:.23,depthWrite:false});
const partObjects=[];
function box(w,h,d,x,y,z,mat,part){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(part){m.userData.part=part;partObjects.push(m);}car.add(m);return m;}
box(1.93,.48,4.54,0,.84,0,paint,null);
box(1.78,.13,1.42,0,1.12,-1.57,paint,"Capô");
box(1.78,.13,.81,0,1.12,1.85,paint,"Porta-malas");
box(1.78,.16,.14,0,.68,-2.3,dark,"Para-choque dianteiro");
box(1.78,.16,.14,0,.68,2.3,dark,"Para-choque traseiro");
box(1.68,.1,1.94,0,1.72,.05,paint,"Teto");
box(1.78,.03,1.82,0,.56,0,dark,null);
for(const sign of [-1,1]){
  const x=sign*1.0;
  const left=sign<0?"Porta esquerda":"Porta direita";
  box(.045,.36,1.46,x,1.03,.02,paint,left);
  box(.032,.065,1.5,x+sign*.025,.84,.03,dark,null);
  for(const z of [-1.5,1.5]){
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.395,.395,.195,32),new THREE.MeshStandardMaterial({color:0x101722,roughness:.92}));tire.rotation.z=Math.PI/2;tire.position.set(sign*1.01,.53,z);tire.castShadow=true;tire.userData.part=z<0?"Roda dianteira":"Roda traseira";partObjects.push(tire);car.add(tire);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(.255,.255,.203,20),chrome);rim.rotation.z=Math.PI/2;rim.position.set(sign*1.01,.53,z);car.add(rim);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.206,20),dark);hub.rotation.z=Math.PI/2;hub.position.set(sign*1.01,.53,z);car.add(hub);
  }
  box(.28,.16,.12,sign*.70,.92,-2.29,light,null);
  box(.25,.17,.11,sign*.70,.94,2.29,red,null);
  box(.22,.095,.34,sign*1.04,1.36,-.77,dark,null);
  box(.12,.14,.28,sign*.33,.65,-2.385,dark,null);
}
function face(verts,mat,part){
  const geometry=new THREE.BufferGeometry();const arr=[];
  const triangles=verts.length===4?[0,1,2,0,2,3]:[0,1,2];
  for(let i of triangles){arr.push(...verts[i]);}
  geometry.setAttribute("position",new THREE.Float32BufferAttribute(arr,3));geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=true;
  if(part){mesh.userData.part=part;partObjects.push(mesh);}car.add(mesh);return mesh;
}
face([[-.79,1.72,-.88],[.79,1.72,-.88],[.87,1.16,-1.35],[-.87,1.16,-1.35]],glass,"Vidro dianteiro");
face([[.79,1.72,1.03],[-.79,1.72,1.03],[-.87,1.17,1.42],[.87,1.17,1.42]],glass,"Vidro traseiro");
for(const sign of [-1,1]){
  const x1=sign*.81,x2=sign*.95;
  face([[x1,1.70,-.83],[x2,1.20,-1.26],[x2,1.21,.01],[x1,1.72,.01]],glass,sign<0?"Porta esquerda":"Porta direita");
  face([[x1,1.72,.10],[x2,1.22,.10],[x2,1.2,1.3],[x1,1.70,1.0]],glass,sign<0?"Porta esquerda":"Porta direita");
  box(.025,.06,.09,sign*1.035,1.18,-.2,chrome,null);
}
const selectGroup=new THREE.Group();car.add(selectGroup);
const anchor={
"Capô":[0,1.24,-1.58],"Para-choque dianteiro":[0,.85,-2.35],"Para-choque traseiro":[0,.85,2.35],
"Porta esquerda":[-1.07,1.14,-.15],"Porta direita":[1.07,1.14,-.15],"Teto":[0,1.85,.12],
"Porta-malas":[0,1.26,1.85],"Vidro dianteiro":[0,1.50,-1.15],"Vidro traseiro":[0,1.54,1.23],
"Roda dianteira":[1.2,.55,-1.5],"Roda traseira":[1.2,.55,1.5]};
function makeMarker(xyz,color=0xffbe6e,r=.10){
 const s=new THREE.Mesh(new THREE.SphereGeometry(r,16,16),new THREE.MeshBasicMaterial({color:color,transparent:true,opacity:.95,depthTest:false}));s.position.set(...xyz);s.renderOrder=10;return s;
}
const selected=makeMarker(anchor["Capô"],0x8affda,.075);selectGroup.add(selected);
let markGroup=new THREE.Group();car.add(markGroup);
function setMarks(marks){car.remove(markGroup);markGroup=new THREE.Group();for(const m of marks||[]){const point=anchor[m.part];if(!point)continue;const position=[point[0],point[1]+.11,point[2]];const dot=makeMarker(position,0xffad6b,.12);const ring=new THREE.Mesh(new THREE.RingGeometry(.16,.21,30),new THREE.MeshBasicMaterial({color:0xffb175,side:THREE.DoubleSide,depthTest:false}));ring.rotation.x=-Math.PI/2;ring.position.set(position[0],position[1]-.08,position[2]);ring.renderOrder=11;markGroup.add(dot,ring);}car.add(markGroup);}
function selectPart(part){if(anchor[part])selected.position.set(...anchor[part]);}
const ray=new THREE.Raycaster();const pointer=new THREE.Vector2();let down;
renderer.domElement.addEventListener("pointerdown",e=>{down={x:e.clientX,y:e.clientY};});
renderer.domElement.addEventListener("pointerup",e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;const b=renderer.domElement.getBoundingClientRect();pointer.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(partObjects,false)[0];if(hit&&hit.object.userData.part){window.dispatchEvent(new CustomEvent("vehicle-part-selected",{detail:{part:hit.object.userData.part}}));}});
function resize(){if(!holder.clientWidth)return;const w=holder.clientWidth,h=holder.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(holder);
window.addEventListener("resize",resize);
function resetCamera(){camera.position.set(6,4.1,7);controls.target.set(0,.8,0);controls.update();}
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}
window.erp3d={setMarks,selectPart,resize,resetCamera};resize();animate();window.dispatchEvent(new Event("vehicle3d-ready"));