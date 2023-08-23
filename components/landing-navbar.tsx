"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"

// Client auth component
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-4">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          EarnSome
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={"/chat"}>
          Chat
        </Link>
        <Link href={isSignedIn ? "/retrieval" : "/sign-up"}>
        Retrieval
        </Link>
        <Link href={isSignedIn ? "/retrieval_agents" : "/sign-up"}>
        Retrieval Agents
        </Link>
        <Link href={isSignedIn ? "/structured_output" : "/sign-up"}>
        Structured Output
        </Link>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="premium" className="rounded-full">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  )
}