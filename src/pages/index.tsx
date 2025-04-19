import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold">GitHub Actions Dashboard</h1>

        {!session ? (
          <>
            <button
              onClick={() => signIn("github")}
              className="px-5 py-2 flex items-center justify-center gap-3 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-semibold w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.89-1.16-.89-1.16-.73-.5.06-.49.06-.49.81.06 1.23.84 1.23.84.72 1.23 1.89.87 2.35.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.52-1.03 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.001 8.001 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Sign in with GitHub
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-300">
              Signed in as <span className="font-semibold">{session.user?.name}</span>
            </p>
            <button
              onClick={() => signOut()}
              className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white font-semibold"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </main>
  );
}
