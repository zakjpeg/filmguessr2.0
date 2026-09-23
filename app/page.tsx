import { Button } from "@/components/buttons/Button";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import FgImage from "@/components/image/FgImage";
import { FilmguessrLogo } from "@/components/logo/FilmguessrLogo";
import Image from "next/image"
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">

      {/* Background Image */}
      <BlurredImageBackground src="https://picsum.photos/50/50"/>
      
      <main className="relative flex flex-1 w-full max-w-6xl flex-col py-32 px-16">

        {/* Floating Container */}
        <div className="absolute top-0 right-0 h-full py-32 px-16 pointer-events-none">
          {/* Sticky Component */}
          <div className="sticky top-10 w-96 pointer-events-auto border border-primary p-2 rounded">
            
            {/* Buttons */}
            <div className="flex flex-row gap-2 items-center">
              <Link href="/play" className="flex-1">
                <Button text="Play" color="green" hover="red"/>
              </Link>
              <Link href="/gamemodes" className="flex-1">
                <Button text="Discover" color="white"/>
              </Link>
            </div>
          </div>
        </div>

        {/* Splash Page */}
        <div className="text-5xl">
          <FilmguessrLogo/>
          <p className="text-2xl">GUESS THE FILM & YEAR</p>
        </div>

      </main>
    </div>
  );
}
