import Link from "next/link";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata = { title: "Lupa password" };

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="back-link">← Nikah Kilat</Link>
      <ForgotPasswordForm />
    </main>
  );
}
