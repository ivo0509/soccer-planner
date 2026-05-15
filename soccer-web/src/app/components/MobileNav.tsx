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
        className="md:hidden p-2"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <svg
          className="w-6 h-6"
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
        <div className="md:hidden pb-4 space-y-2">
          <Link
            href="/"
            className="block px-3 py-2 rounded hover:bg-blue-500 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-blue-100">
                Signed in as <span className="font-semibold">{user.name}</span>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="block w-full text-left px-3 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 transition font-semibold"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-3 py-2 rounded hover:bg-blue-500 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 transition font-semibold"
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
