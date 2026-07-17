"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession, logout, type AuthUser } from "../lib/auth";

const links = [["/dashboard", "Overview"], ["/discover", "Discover matches"], ["/matches", "My matches"], ["/chat", "Messages"], ["/services", "Wedding services"], ["/settings", "Settings"]];

export function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => { const session = getSession(); if (!session) router.replace("/login"); else setUser(session.user); }, [router]);
  async function signOut() { await logout(); clearSession(); router.replace("/login"); }
  return <div className="min-h-screen bg-rose-50 md:flex"><aside className="hidden w-64 shrink-0 border-r border-rose-100 bg-white p-5 md:block"><Link href="/dashboard" className="text-2xl font-bold text-brand-700">Mangal</Link><p className="mt-1 text-xs text-slate-500">Your meaningful journey</p><nav className="mt-10 space-y-1">{links.map(([href,label])=><Link key={href} href={href} className={`block rounded-xl px-3 py-2.5 text-sm ${pathname===href ? "bg-rose-100 font-semibold text-brand-700" : "text-slate-600 hover:bg-rose-50"}`}>{label}</Link>)}</nav><button onClick={signOut} className="mt-10 w-full rounded-xl px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Log out</button></aside><div className="min-w-0 flex-1"><header className="flex items-center justify-between border-b border-rose-100 bg-white px-5 py-4 md:px-8"><Link href="/dashboard" className="font-bold text-brand-700 md:hidden">Mangal</Link><div className="ml-auto flex items-center gap-3"><span className="hidden text-sm text-slate-600 sm:block">{user?.email}</span><button onClick={signOut} className="rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50 md:hidden">Log out</button></div></header><nav className="flex gap-2 overflow-x-auto border-b border-rose-100 bg-white px-4 py-2 md:hidden">{links.slice(0,5).map(([href,label])=><Link key={href} href={href} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs ${pathname===href ? "bg-rose-100 text-brand-700" : "text-slate-600"}`}>{label}</Link>)}</nav><main>{children}</main></div></div>;
}
