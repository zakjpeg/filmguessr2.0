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

        // validate email
        if (!EmailValidator.validate(inputEmail)) {
            setError("We couldn't validate your email. Please try again, or use a different email.")
            return;
        }
        
        // optimistically update UI to next stage
        setStage(2)
        const { data: { user }, error} = await supabase.auth.signInWithOtp({
            email: inputEmail,
        })
        
        if (error) {
            setStage(1);
            setError("We couldn't register your account. Please try again, or use a different email.");
        }

    }


    return (
        <div className="bg-linear-0 from-accent/18 to-transparent gap-6 flex-1 flex flex-col justify-center items-center">
            <BlurredImageBackground src="https://picsum.photos/500/500"/>
            <div className="flex flex-col gap-6 bg-background p-12 rounded-2xl shadow-xl w-120">
                {stage == 1 && <>
                <div>
                    <p className="font-bold text-4xl uppercase"><span className="text-accent">JOIN</span> FILMGUESSR</p>
                    <p className="text-primary/75">Play unlimited games, level up, join the leaderboards</p>
                </div>
                { /* Error State*/
                    error &&
                    <div className="flex flex-row items-center gap-3 p-3 rounded-md border-red-500 text-red-500 bg-red-500/10">
                    <MdOutlineError className="shrink-0" size={26}/>
                    <p>{error}</p>
                    </div>
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
                <div>
                    <p className="font-bold text-4xl uppercase"><span className="text-accent">CHECK</span> YOUR INBOX</p>
                    <p className="text-primary/75">Enter the verification code we just sent, or click the link in the email.</p>
                    {/* ZAK TODO: Add verification using 6 digit OTP code */}
                </div>
                </>}


            </div>
        </div>
    )
}