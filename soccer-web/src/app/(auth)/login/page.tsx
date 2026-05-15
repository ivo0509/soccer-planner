import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-12">
      <LoginForm />
    </div>
  );
}
