import SessionGuard from "@/components/SessionGuard";
import DaySummaryPage from "@/components/daySummaryPage/Page";
import React from "react";

export default function DaySummaryPage2() {
    return (
      <SessionGuard>
        <main className="fullHeight">
            <DaySummaryPage />
        </main>
      </SessionGuard>
    );
}