import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const src=readFileSync(new URL("../src/lib/workflow.ts",import.meta.url),"utf8");
const transitions=Object.fromEntries([...src.matchAll(/^\s*([A-Z]+):\[([^\]]*)\]/gm)].map(m=>[m[1],(m[2].match(/"([A-Z]+)"/g)||[]).map(x=>x.slice(1,-1))]));
function allowed(a,b){return (transitions[a]||[]).includes(b);}
test("comanda percorre fluxo permitido",()=>{assert.equal(allowed("AWAITING","INSPECTION"),true);assert.equal(allowed("INSPECTION","WASHING"),true);assert.equal(allowed("QUALITY","READY"),true);assert.equal(allowed("READY","DELIVERED"),true);});
test("etapas não pulam e finais são terminais",()=>{assert.equal(allowed("AWAITING","DELIVERED"),false);assert.equal(allowed("DELIVERED","WASHING"),false);assert.equal(allowed("CANCELLED","READY"),false);});
test("sem status desconhecido",()=>{assert.equal(allowed("UNKNOWN","READY"),false);});
