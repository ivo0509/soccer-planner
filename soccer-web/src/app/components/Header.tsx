import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "../(auth)/actions";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold">⚽ Soccer Planner</span>
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:text-blue-100 transition">
              Home
            </Link>
            {user ? (
              <>
                <span className="text-sm text-blue-100">
                  Signed in as <span className="font-semibold">{user.name}</span>
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition font-semibold"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-100 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <MobileNav user={user} />
        </div>
      </nav>
    </header>
  );
}
