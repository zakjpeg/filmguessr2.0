"use client";

import Link from "next/link"
import { DiVim } from "react-icons/di"
import { Button } from "@/components/buttons/Button";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="bg-linear-0 from-accent/18 to-background gap-6 flex-1 flex flex-col justify-center items-center">
            <Image src="/404/heresjohnny.png" alt="404 Error" width={100} height={100}/>
            <div className="text-center">
                <p className="font-bold text-5xl">404: BEHIND THE SCENES</p>
                <p className="text-xl font-light opacity-50">Sorry, we couldn&apos;t find that page.</p>
            </div>
            <Link href="/">
                <Button text="Return home" color="green" hover="white"/>
            </Link>
        </div>
    )
}