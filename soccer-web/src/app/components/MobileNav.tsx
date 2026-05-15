"use client";

import Link from "next/link";
import { useState } from "react";
import type { AuthUser } from "@/lib/auth";
import { logoutAction } from "../(auth)/actions";

type MobileNavProps = {
  user: AuthUser | null;
};

export function MobileNav({ user }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-1.5 sm:p-2"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <svg
          className="w-5 sm:w-6 h-5 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isMenuOpen && (
        <div className="md:hidden absolute top-14 sm:top-16 left-0 right-0 bg-blue-600 pb-4 space-y-2 px-4">
          <Link
            href="/"
            className="block px-2 py-2 rounded hover:bg-blue-500 transition text-sm sm:text-base"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block px-2 py-2 rounded hover:bg-blue-500 transition text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/groups"
                className="block px-2 py-2 rounded hover:bg-blue-500 transition text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Groups
              </Link>
              <div className="px-2 py-2 text-xs sm:text-sm text-blue-100 break-words">
                Signed in as <span className="font-semibold">{user.name}</span>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="block w-full text-left px-2 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 transition font-semibold text-sm sm:text-base"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-2 py-2 rounded hover:bg-blue-500 transition text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-2 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 transition font-semibold text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
