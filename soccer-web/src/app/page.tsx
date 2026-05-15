import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-12">
      <div className="max-w-2xl text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-blue-900 mb-4">
            ⚽ Welcome to Soccer Planner
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-2">
            Organize your football matches, manage team members, and keep
            everyone connected.
          </p>
          <p className="text-base sm:text-lg text-gray-600">
            The easiest way to coordinate matches with your friends and groups.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Manage Groups
            </h3>
            <p className="text-gray-600">
              Create and manage football groups with your friends
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Schedule Matches
            </h3>
            <p className="text-gray-600">
              Organize upcoming matches and track past games
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Communicate
            </h3>
            <p className="text-gray-600">
              Share comments and updates about your matches
            </p>
          </div>
        </div>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition text-center"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
