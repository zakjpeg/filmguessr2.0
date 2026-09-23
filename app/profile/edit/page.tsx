"use client";

import Link from "next/link"
import { DiVim } from "react-icons/di"
import { Button } from "@/components/buttons/Button";
import Image from "next/image";
import BlurredImageBackground from "@/components/image/BlurredImageBackground";
import { useEffect, useState } from "react";
import * as EmailValidator from "email-validator"
import { MdMovie, MdOutlineChevronLeft, MdOutlineChevronRight, MdOutlineError } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import signOut from "@/lib/auth/client/signOut";
import clsx from "clsx";
import { User } from "@supabase/supabase-js";
import Avatar from "@/components/user/Avatar";
import { IoMdSave } from "react-icons/io";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import { FaCrop, FaX } from "react-icons/fa6";
import { AVATAR_COLORS_PRIMARY, AVATAR_COLORS_SECONDARY, AVATAR_ICONS } from "@/lib/avatar/client/avatar.types";
import { IconType } from "react-icons";
import ErrorMessage from "@/components/error/ErrorMessage";

export default function Profile() {
    const supabase = createClient();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<"home" | "name" | "avatar">("home")
    const [error, setError] = useState<string | null>();

    const [inputName, setInputName] = useState<string>("");
    const [inputColor1, setInputColor1] = useState<string>("#ff00ff");
    const [inputColor2, setInputColor2] = useState<string>("#00ffff");
    const [inputIcon, setInputIcon] = useState<string>("");


    useEffect(() => {
        const helper = async () => {
            setLoading(true);
            setError(null);
            // check if user is logged in
            const {data: { user: userData }} = await supabase.auth.getUser();

            if (!userData?.id) {
                router.replace('/');
                return;
            } else {
                setUser(userData);
            }

            const {data: profile, error: profileError} = await supabase
            .from('profile')
            .select('*')
            .eq('user_id', userData.id)
            .single();

            if (!profile || profileError) {
                setError("We couldn't load your profile. Please try again later");
                return;
            }

            setInputName(profile.name);
            setInputColor1(profile.color_primary);
            setInputColor2(profile.color_secondary);
            setInputIcon(profile.icon);



            setLoading(false);
        }
        helper();
    }, [])

    function handleReturnHome() {
        setPage("home");
    }

    function handleEditName() {
        setPage("name");
    }

    function handleEditAvatar() {
        setPage("avatar");
    }

    function handleSaveName() {

    }

    function handleSaveAvatar() {

    }
    

    return (
        <div className={clsx(
            "bg-linear-0 from-accent/18 to-transparent gap-6 flex-1 flex flex-col justify-start items-center p-16 pt-0",
            "max-md:p-2"
        )}>
            <BlurredImageBackground src="https://picsum.photos/500/500"/>
            {/* User Info */}
            <div className={clsx(
                "min-w-100 max-w-130 flex flex-col gap-6 bg-background p-8 rounded-2xl shadow-xl flex-1 h-full sticky top-10 overflow-hidden",
                "max-md:static max-md:w-full"
            )}>
                {/* Error */}
                {error &&
                <ErrorMessage text={error}/>
                }
                {/* User data */}
                <div className="flex flex-col gap-4 items-center">
                    <Avatar
                    outline={true}
                    size={24}
                    profile={
                        {
                            icon: inputIcon,
                            color_primary: inputColor1,
                            color_secondary: inputColor2
                        }
                    }
                    />
                    <p className="font-bold text-2xl line-clamp-1 text-ellipsis shrink">
                        {inputName}
                    </p>
                </div>

                {// Return button
                page !== "home" &&
                <div className="flex justify-center items-center w-10 h-10 hover:bg-primary/15 absolute top-4 left-4 cursor-pointer rounded-full"
                onClick={handleReturnHome}
                >
                    <MdOutlineChevronLeft size={32}/>
                </div>
                }

                {// Home
                    page === "home" &&
                    <div className="flex flex-col gap-2">
                        <button
                            className="flex flex-row gap-1 justify-center items-center bg-primary/5 hover:bg-primary/10 transition-colors py-2 rounded-md cursor-pointer"
                            onClick={handleEditName}
                        >
                            <p className="text-lg">Edit Name</p>
                            <MdOutlineChevronRight size={24}/>
                        </button>

                        <button
                            className="flex flex-row gap-1 justify-center items-center bg-primary/5 hover:bg-primary/10 transition-colors py-2 rounded-md cursor-pointer"
                            onClick={handleEditAvatar}
                        >
                            <p className="text-lg">Change Avatar</p>
                            <MdOutlineChevronRight size={24}/>
                        </button>
                    </div>
                }

                {// Edit name
                page === "name" && 
                <div className="h-full flex flex-col gap-1">
                    <p className="text-2xl font-bold">Name</p>
                    <input 
                    autoFocus
                    type="text" 
                    className="focus:outline-0 text-ellipsis bg-primary/5 w-full text-primary text-2xl py-2 px-4 rounded-2xl"
                    placeholder="Enter your username"
                    value={inputName}
                    onChange={(e) => {
                        setInputName(e.target.value);
                    }}
                    />
                    <button
                        className="mt-6 flex flex-row gap-1 justify-center items-center bg-primary/5 hover:bg-primary/10 transition-colors py-2 rounded-md cursor-pointer"
                        onClick={handleSaveName}
                    >
                        <IoMdSave />
                        <p className="text-lg">Save Changes</p>
                    </button>
                </div>
                }

                {// Edit avatar
                page === "avatar" && 
                <div className="h-full flex flex-col gap-4">
                    <div>
                    <p className="text-2xl font-bold">Icon</p>
                    <div className="flex flex-row gap-2 flex-wrap">
                    {AVATAR_ICONS.map((icon, idx) => (
                        <div
                        key={icon.name}
                        className="w-8 h-8 bg-primary/5 flex justify-center items-center rounded-full cursor-pointer"
                        onClick={() => {
                            setInputIcon(icon.name)
                        }}
                        >
                            {AVATAR_ICONS.find((key) => (key.name === icon.name))?.icon}
                        </div>
                    ))}
                    </div>
                    </div>
                    <div>
                    <p className="text-xl font-bold mb-1">Color #1</p>
                    <div className="flex flex-row gap-2">
                    {AVATAR_COLORS_PRIMARY.map((key, idx) => (
                        <div
                        key={key}
                        className={clsx(
                            "w-5 h-5 rounded-full outline-1 outline-offset-2 cursor-pointer",
                            inputColor1 === key ? "outline-accent" : "outline-primary/15"
                        )}
                        style={{
                            backgroundColor: key
                        }}
                        onClick={() => {
                            setInputColor1(key)
                        }}
                        />
                    ))}
                    </div>
                    </div>
                    <div>
                    <p className="text-xl font-bold mb-1">Color #2</p>
                    <div className="flex flex-row gap-2">
                    {AVATAR_COLORS_SECONDARY.map((key, idx) => (
                        <div
                        key={key}
                        className={clsx(
                            "w-5 h-5 rounded-full outline-1 outline-offset-2 cursor-pointer",
                            inputColor2 === key ? "outline-accent" : "outline-primary/15"
                        )}
                        style={{
                            backgroundColor: key
                        }}
                        onClick={() => {
                            setInputColor2(key)
                        }}
                        />
                    ))}
                    </div>
                    </div>
                    <button
                        className="mt-6 flex flex-row gap-1 justify-center items-center bg-primary/5 hover:bg-primary/10 transition-colors py-2 rounded-md cursor-pointer"
                        onClick={handleSaveAvatar}
                    >
                        <IoMdSave />
                        <p className="text-lg">Save Changes</p>
                    </button>
                </div>

                }
                
            </div>

        </div>
    )
}