import {z} from "zod";
import type {Role} from "./auth";
const text=z.string().trim().min(1).max(160);
const opt=z.string().trim().max(500).nullable().optional();
const uuid=z.uuid();
export const schema={
 customers:z.object({name:text,phone:opt,email:z.email().nullable().optional(),notes:opt}).strict(),
 vehicles:z.object({customer_id:uuid,plate:z.string().trim().min(6).max(9).regex(/^[A-Za-z0-9-]+$/).transform(s=>s.toUpperCase()),brand:opt,model:text,color:opt,year:z.number().int().min(1900).max(2100).nullable().optional()}).strict(),
 services:z.object({name:text,price_cents:z.number().int().min(0).max(100000000),duration_minutes:z.number().int().min(1).max(1440),active:z.boolean().optional()}).strict(),
 appointments:z.object({customer_id:uuid,vehicle_id:uuid,service_id:uuid,starts_at:z.iso.datetime(),ends_at:z.iso.datetime(),status:z.enum(["scheduled","confirmed","arrived","cancelled","done"]).optional(),notes:opt}).strict().refine(v=>v.ends_at>v.starts_at,{message:"Horário final deve ser posterior ao inicial"}),
 staff:z.object({name:text,role:z.enum(["manager","cashier","operator","inspector","viewer"]),email:z.email().nullable().optional(),active:z.boolean().optional()}).strict(),
 stock_items:z.object({name:text,sku:opt,quantity:z.number().min(0).max(10000000).optional(),min_quantity:z.number().min(0).max(10000000).optional(),cost_cents:z.number().int().min(0).max(100000000).optional()}).strict()
} as const;
export type Resource=keyof typeof schema;
export function isResource(key:string):key is Resource{return Object.prototype.hasOwnProperty.call(schema,key)}
export function canWrite(resource:Resource,role:Role):boolean{
 const allowed:Record<Resource,Role[]>={
 customers:["owner","manager","operator","cashier"],
 vehicles:["owner","manager","operator","inspector"],
 services:["owner","manager"],
 appointments:["owner","manager","operator"],
 staff:["owner","manager"],
 stock_items:["owner","manager"]
 };
 return allowed[resource].includes(role);
}
