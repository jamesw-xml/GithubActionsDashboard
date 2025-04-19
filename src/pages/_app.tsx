import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../app/globals.css";
import Navbar from "@/components/navbar";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <main className="p-6">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
