"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, logout } from "../lib/auth";

export function SiteHeader(){
  const router = useRouter(); const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { setSignedIn(Boolean(getSession())); }, []);
  async function signOut() { await logout(); setSignedIn(false); router.push("/"); }
  return <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="text-xl font-bold tracking-tight text-brand-700">Mangal</Link><nav className="hidden gap-6 text-sm md:flex"><Link href="/discover">Discover</Link><Link href="/pricing">Membership</Link><Link href="/services">Wedding services</Link></nav><div className="flex gap-2">{signedIn ? <><Link className="btn-secondary" href="/dashboard">Dashboard</Link><button className="btn-primary" onClick={signOut}>Log out</button></> : <><Link className="btn-secondary" href="/login">Log in</Link><Link className="btn-primary" href="/signup">Create profile</Link></>}</div></header>;
}
