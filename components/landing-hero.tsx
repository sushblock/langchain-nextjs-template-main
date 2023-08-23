"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";

//client auth component
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>Your online F2F Tutor!</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypewriterComponent
            options={{
              strings: [
                "Former professionals!",
                "Expert students!",
                "Teachers!",
                "Artists!",
                "Artisans!",
                "Entrepreneurs!",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div> 
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
          Start Teaching today!
          </Button>
        </Link>
      </div>
    </div>
  );
};
