import Link from "next/link";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata = { title: "Atur password baru" };

export default function ResetPasswordPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="back-link">← Nikah Kilat</Link>
      <ResetPasswordForm />
    </main>
  );
}
