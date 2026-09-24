"use client";

import Link from "next/link"
import { DiVim } from "react-icons/di"
import { Button } from "@/components/buttons/Button";
import Image from "next/image";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { useEffect, useState } from "react";
import * as EmailValidator from "email-validator"
import { MdOutlineError } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/error/ErrorMessage";
import { BiLogoGmail } from "react-icons/bi";

export default function Join() {
    const supabase = createClient();
    const router = useRouter();

    const [inputEmail, setInputEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [stage, setStage] = useState<1 | 2>(1);

    const buttonDisabled = !EmailValidator.validate(inputEmail);

    // check if user is logged in
    useEffect(() => {
        const helper = async () => {
            const {data: { user }} = await supabase.auth.getUser();

            if (user) {
                router.replace('/');
            }
        }
        helper();
    }, [])

    async function handleJoin() {

        // clear errors
        setError(null);
        
        // optimistically update UI to next stage
        setStage(2)

        // Sign in with OTP
        const { error} = await supabase.auth.signInWithOtp({
            email: inputEmail,
        });
        
        // Handle errors
        if (error) {
            setStage(1);
            setError("We couldn't register your account. Please try again, or use a different email.");
            return;
        }

    }


    return (
        <div className="bg-linear-0 from-accent/18 to-transparent gap-6 flex-1 flex flex-col justify-center items-center">
            <BlurredImageBackground src="https://picsum.photos/500/500"/>
            <div className="flex flex-col gap-6 bg-background p-12 rounded-2xl shadow-xl w-120">
                {stage == 1 && <>
                <div>
                    <p className="font-bold text-4xl uppercase"><span className="text-accent">JOIN</span> FILMGUESSR</p>
                    <p className="text-primary/75">Play unlimited games, level up, climb the leaderboards</p>
                </div>
                { /* Error State*/
                    error &&
                    <ErrorMessage text={error}/>
                }
                <div className="flex flex-col gap-1">
                    <p className="text-2xl font-bold">Email</p>
                    <input 
                    autoFocus
                    type="text" 
                    className="focus:outline-0 text-ellipsis bg-primary/5 w-full text-primary text-2xl py-2 px-4 rounded-2xl"
                    placeholder="Enter your email"
                    value={inputEmail}
                    onChange={(e) => {
                        setInputEmail(e.target.value);
                    }}
                    />
                </div>

                <Button
                    text="JOIN"
                    color="white"
                    hover="green"
                    disabled={buttonDisabled}
                    onClick={handleJoin}
                />
                </>}
                {stage == 2 && <>
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="font-bold text-4xl uppercase"><span className="text-accent">CHECK</span> YOUR INBOX</p>
                        <p className="text-primary/75 text-xl">Sign in using the link in the email.</p>
                    </div>
                    <hr className="text-primary/15"/>
                    <div className="flex flex-row justify-center items-center gap-4 ">
                        <a className="flex justify-center items-center h-14 w-14 cursor-pointer hover:bg-primary/5 p-2 rounded-md"
                        href="https://gmail.com"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Gmail_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
                            alt="Gmail"
                            />
                        </a>
                        <a className="flex justify-center items-center h-14 w-14 cursor-pointer hover:bg-primary/5 p-2 rounded-md"
                        href="https://outlooki.com"
                        >
                            <img
                            src="https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Microsoft_Outlook_Icon_%282025%E2%80%93present%29.svg/1280px-Microsoft_Outlook_Icon_%282025%E2%80%93present%29.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20251003204701"
                            alt="Outlook"
                            />
                        </a>
                        <a className="flex justify-center items-center h-14 w-14 cursor-pointer hover:bg-primary/5 p-2 rounded-md"
                        href="https://icloud.com"
                        >
                            <img
                            src="https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/ICloud_logo.svg/250px-ICloud_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20200306180013"
                            alt="iCloud"
                            />
                        </a>

                    </div>
                </div>
                </>}


            </div>
        </div>
    )
}