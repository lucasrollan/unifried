import SessionGuard from "@/components/SessionGuard";
import Timeline from "@/components/timeline/Timeline";
import React from "react";

export default function TimelinePage() {
  return (
    <SessionGuard>
      <main className="fullHeight">
        <Timeline />
      </main>
    </SessionGuard>
  );
}