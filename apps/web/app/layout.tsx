import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata={title:"Mangal | Meaningful Matches",description:"Secure, verified AI-powered matrimony and wedding services."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body suppressHydrationWarning>{children}</body></html>}
