import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md flex items-center justify-between">
      <div className="text-xl font-semibold">
        <Link href="/">GitHub Actions Dashboard</Link>
      </div>
      <div className="space-x-4">
        {session ? (
          <>
            <Link href="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>
            <Link href="/" onClick={() => signOut()} className="hover:text-blue-400 transition">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link href="/" className="hover:text-blue-400 transition">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
