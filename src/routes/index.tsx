import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Static sports club site lives in /public — redirect to it.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/apex-sports-club/club.html");
    }
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0A1F44", color: "#fff", fontFamily: "system-ui" }}>
      <p>Loading APEX Sports Club…</p>
    </div>
  );
}
