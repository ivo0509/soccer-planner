import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-12">
      <RegisterForm />
    </div>
  );
}
