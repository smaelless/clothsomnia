import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { isConfigured, isSignedIn } from "@/lib/admin";

export default async function LoginPage() {
  if (await isSignedIn()) redirect("/admin");

  return (
    <div className="mx-auto grid min-h-[70svh] max-w-sm place-items-center">
      <div className="w-full">
        <p className="label-wide text-lime">Clothsomnia</p>
        <h1 className="display mt-3 text-4xl leading-[0.95]">Back office</h1>
        <p className="mt-4 text-sm leading-relaxed text-smoke">
          Orders, stock and everything a customer trusted you with.
        </p>

        {isConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-8 rounded-2xl border border-magenta/40 p-5 text-sm leading-relaxed text-silver">
            The admin has no password yet. Set <code className="text-lime">ADMIN_PASSWORD</code> in
            your environment — at least eight characters — and reload this page.
          </p>
        )}
      </div>
    </div>
  );
}
