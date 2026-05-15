import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "../(auth)/actions";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold">⚽ Soccer Planner</span>
          </Link>

          <div className="hidden md:flex gap-3 sm:gap-6 items-center">
            <Link href="/" className="hover:text-blue-100 transition text-sm sm:text-base">
              Home
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-100 transition text-sm sm:text-base">
                  Dashboard
                </Link>
                <Link href="/groups" className="hover:text-blue-100 transition text-sm sm:text-base">
                  Groups
                </Link>
                <span className="text-xs sm:text-sm text-blue-100">
                  Signed in as <span className="font-semibold">{user.name}</span>
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-50 transition font-semibold text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-100 transition text-sm sm:text-base">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-blue-50 transition font-semibold text-sm sm:text-base"
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
