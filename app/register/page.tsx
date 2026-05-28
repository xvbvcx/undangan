import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";

export default function RegisterPage() {
  return <main className="auth-page"><Link href="/" className="back-link">← Nikah Kilat</Link><AuthForm mode="register" /></main>;
}
