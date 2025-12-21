import React from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  userName?: string;
  userInitials?: string;
  userAvatar?: string;
  homeUrl?: string;
}

export default function Header({
  logoSrc,
  logoAlt = "Logo",
  userName,
  userInitials,
  userAvatar,
  homeUrl = "/",
}: HeaderProps) {
  return (
    <div className="w-full border-b bg-emerald-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo */}
        <Link href={homeUrl} className="flex items-center gap-2 font-semibold cursor-pointer hover:opacity-80 transition-opacity">
          {logoSrc ? (
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <span>PasJajan</span>
            </div>
          ) : (
            <span className="rounded bg-white/10 px-2 py-1">PasJajan</span>
          )}
        </Link>

        {/* Right side - User Info - Only show if user is logged in */}
        {(userName || userInitials) && (
          <div className="flex items-center gap-2 text-sm">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || "User"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center">
                {userInitials}
              </div>
            )}
            {userName && <span>{userName}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
