import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
      {/* Link component for navigation to the home page */}
      <Link href="/" className="md:flex-1">
        <Image
          src="/assets/icons/logo.svg"
          alt="logo with name"
          width={120}
          height={32}
          className="hidden md:block" // Shows on medium (md) and larger screens
        />
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="logo"
          width={32}
          height={32}
          className="mr-2 md:hidden" // Shows on smaller screens
        />
      </Link>
      {/* Render any children passed to the Header component */}
      {children}
    </div>
  );
};

export default Header;
