import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"Freitas ERP | Laboratório SaaS",description:"Gestão de lava-rápidos da Freitas Corp. Ambiente de homologação.",robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="pt-BR"><body>{children}</body></html>;
}
