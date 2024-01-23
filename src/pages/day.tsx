import SessionGuard from "@/components/SessionGuard";
import DaySummaryPage from "@/components/daySummaryPage/Page";
import Head from "next/head";
import React from "react";

export default function DaySummaryPage2() {
    return (
      <SessionGuard>
        <Head>
          <title>Daily tasks</title>
        </Head>
        <main className="fullHeight">
            <DaySummaryPage />
        </main>
      </SessionGuard>
    );
}