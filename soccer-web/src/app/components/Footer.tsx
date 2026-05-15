import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export async function Footer() {
  const user = await getCurrentUser();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-2">About Soccer Planner</h3>
            <p className="text-sm">
              Organize your football matches, manage team members, and keep track
              of upcoming games all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link href="/login" className="hover:text-white transition">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="hover:text-white transition"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-2">Contact</h3>
            <p className="text-sm">
              Have questions? Reach out to us at{" "}
              <a href="mailto:info@soccerplanner.com" className="hover:text-white transition">
                info@soccerplanner.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Soccer Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
