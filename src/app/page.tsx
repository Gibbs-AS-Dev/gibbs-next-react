"use client";
import type * as React from "react";
import { useSession } from "next-auth/react"; // Import useSession from next-auth
import { useEffect } from "react";

import { redirect } from "next/navigation";
import { paths } from "@/paths";

export default function Page(): React.JSX.Element {
  const { data: session, status } = useSession(); // Get session data and status

  useEffect(() => {
    // Wait until session status is determined
    if (status === "loading") return; // Don't redirect while loading the session

    // Redirect based on session status
    if (status === "authenticated") {
      // If user is authenticated, redirect to dashboard
      redirect(paths.dashboard.overview);
    } else {
      // If user is not authenticated, redirect to sign-in page
      redirect(paths.auth.custom.signIn);
    }
  }, [status]); // Dependency on session status

  // While the session is loading, you can show a loading state
  return <div>Loading...</div>;
}
