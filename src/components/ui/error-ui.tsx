"use client";

import { Link } from "@/i18n/routing";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

interface ErrorUIProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
}

export function ErrorUI({
  title = "An error occurred",
  message = "There was a problem processing your request. Please try again later.",
  actionText = "Retry",
  actionHref = "/",
}: ErrorUIProps) {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.log(error);
      }
    };
    handleLogout();
  }, []);
  return (
    <div className="p-8 text-center">
      <h2 className="mb-4 font-bold text-2xl">{title}</h2>
      <p className="mb-4 text-muted-foreground">{message}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-block bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-white"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
