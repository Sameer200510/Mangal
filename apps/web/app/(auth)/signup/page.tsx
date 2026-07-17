"use client";
import { useState } from "react";
import Link from "next/link";
import { saveSession, type AuthSession } from "../../../lib/auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export default function Signup() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(formData: FormData) {
    setMessage("");
    setSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/auth/register`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), password: formData.get("password"), role: formData.get("role") }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) setMessage(data?.error?.message ?? "We could not create your account. Please check your details and try again.");
      else { saveSession(data as AuthSession); location.assign("/dashboard"); }
    } catch {
      setMessage("Mangal API is not running. Start it with: pnpm --filter @mangal/api dev");
    } finally { setSubmitting(false); }
  }

  return <main className="grid min-h-screen place-items-center p-6"><form action={submit} className="glass w-full max-w-md rounded-3xl p-8"><Link href="/" className="font-bold text-brand-700">Mangal</Link><h1 className="mt-6 text-2xl font-bold">Create your profile</h1><label className="mt-5 block text-sm font-medium">Email<input className="mt-1 w-full rounded-xl border p-3" name="email" type="email" required/></label><label className="mt-4 block text-sm font-medium">I am a<select className="mt-1 w-full rounded-xl border p-3" name="role"><option value="BRIDE">Bride</option><option value="GROOM">Groom</option><option value="PARENT">Parent / family</option></select></label><label className="mt-4 block text-sm font-medium">Password<input className="mt-1 w-full rounded-xl border p-3" name="password" type="password" minLength={12} required/></label>{message&&<p className="mt-3 text-sm text-slate-700">{message}</p>}<button className="btn-primary mt-6 w-full" disabled={submitting}>{submitting ? "Creating…" : "Create account"}</button></form></main>;
}
