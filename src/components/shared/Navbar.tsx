"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export const Navbar = () => {
  const session = useSession();

  const handleLogin = async () => {
    await signIn("google");
  };
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="border-b">
      <div className="mx-auto w-full max-w-xs sm:max-w-2xl md:max-w-6xl md:px-6">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2">
          <Link href={"/"}>
            <h1 className="leading-none font-semibold tracking-tight sm:leading-[1.15]">
              <span className="block">Aspirasi</span>
              <span className="block">Darrell</span>
            </h1>
          </Link>

          <div className="flex items-center gap-2">
            {session.data?.user ? (
              <Button onClick={handleLogout} size="sm">
                Sign Out
              </Button>
            ) : (
              <Button onClick={handleLogin} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
