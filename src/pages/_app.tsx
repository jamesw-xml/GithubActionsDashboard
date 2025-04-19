import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../app/globals.css";
import Navbar from "@/components/navbar";
import Head from "next/head";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>GitHub Actions Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="p-6">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
