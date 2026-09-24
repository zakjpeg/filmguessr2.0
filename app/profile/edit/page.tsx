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
import { CHARLIM_NAME, CHARMIN_NAME } from "@/lib/constants/constants";
import { useProfileStore } from "@/stores/useProfileStore";

export default function Profile() {
    const supabase = createClient();
    const router = useRouter();
    const {profile, user, fetchProfile, loading: profileLoading} = useProfileStore();

    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<"home" | "name" | "avatar">("home")
    const [error, setError] = useState<string | null>();

    const [inputName, setInputName] = useState<string>("");
    const [inputColor1, setInputColor1] = useState<string>("");
    const [inputColor2, setInputColor2] = useState<string>("");
    const [inputIcon, setInputIcon] = useState<string>("star");

    useEffect(() => {
        async function helper() {
            if (profileLoading) {
                return;
            }
            
            if (!user) {
                router.replace('/');
                return;
            }

            if (profile) {
                setInputName(profile.name);
                setInputIcon(profile.icon);
                setInputColor1(profile.color_primary);
                setInputColor2(profile.color_secondary);
            }
        }
        helper();
    }, [profile])

    function handleReturnToProfile() {
        router.push('/profile');
    }

    function handleReturnHome() {
        setPage("home");
    }

    function handleEditName() {
        setPage("name");
    }

    function handleEditAvatar() {
        setPage("avatar");
    }

    async function handleSaveName() {

        setLoading(true);

        if (!user || !user.id) {
            setError("We couldn't update your name. Please try again later.");
            setLoading(false);
            return;
        }

        const {error} = await supabase
        .from('profile')
        .update({name: inputName})
        .eq('user_id', user.id);
        
        if (error) {
            setError("We couldn't update your name. Please try again later.")
            setLoading(false);
            return;
        }

        fetchProfile(user.id);

        setLoading(false);
        setPage("home");

    }

    async function handleSaveAvatar() {

        setLoading(true);

        if (!user || !user.id) {
            setError("We couldn't update your avatar. Please try again later.");
            setLoading(false);
            return;
        }

        const {error} = await supabase
        .from('profile')
        .update({
            icon: inputIcon,
            color_primary: inputColor1,
            color_secondary: inputColor2,
        })
        .eq('user_id', user.id);
        
        if (error) {
            setError("We couldn't update your avatar. Please try again later.")
            setLoading(false);
            return;
        }

        fetchProfile(user.id);

        setLoading(false);
        setPage("home");

    }

    const saveNameDisabled = inputName.length < CHARMIN_NAME || inputName.length > CHARLIM_NAME || loading;
    console.warn( loading);
    const saveAvatarDisabled = !inputColor1 || !inputColor2 || !inputIcon || loading
    

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

                {// Return button
                page === "home"
                ?
                <div className="flex justify-center items-center w-10 h-10 hover:bg-primary/15 absolute top-4 left-4 cursor-pointer rounded-full"
                onClick={handleReturnToProfile}
                >
                    <MdOutlineChevronLeft size={32}/>
                </div>
                :
                <div className="flex justify-center items-center w-10 h-10 hover:bg-primary/15 absolute top-4 left-4 cursor-pointer rounded-full"
                onClick={handleReturnHome}
                >
                    <MdOutlineChevronLeft size={32}/>
                </div>
                }

                {// Home
                    page === "home" &&
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-4 items-center mb-6">
                            <Avatar
                            loading={profileLoading}
                            outline={true}
                            size={24}
                            profile={profile ?? undefined}
                            />
                            {profileLoading
                            ? <p className="select-none text-transparent bg-primary/15 rounded-md font-bold text-2xl ">
                                Edit Username
                            </p>
                            : <p className="font-bold text-2xl line-clamp-1 text-ellipsis shrink">
                                {profile?.name ? '@' + profile.name : "Edit your name"}
                            </p>
                            }
                        </div>
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
                <div className="mt-12 h-full flex flex-col gap-1">
                    <p className="text-2xl font-bold">Name</p>
                    <input 
                    autoFocus
                    type="text" 
                    className="focus:outline-0 text-ellipsis bg-primary/5 w-full text-primary text-2xl py-2 px-4 rounded-2xl"
                    placeholder="Enter your username"
                    maxLength={CHARLIM_NAME}
                    value={inputName}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9._]/g, "");
                        setInputName(value.toLowerCase());
                    }}
                    />
                    <button
                        className={clsx(
                            "select-none mt-6 flex flex-row gap-1 justify-center items-center bg-primary/5 transition-colors py-2 rounded-md",
                            saveNameDisabled ? "opacity-50" : "cursor-pointer hover:bg-primary/10"
                        )}
                        onClick={handleSaveName}
                        disabled={saveNameDisabled}
                    >
                        <IoMdSave />
                        <p className="text-lg">Save Changes</p>
                    </button>
                </div>
                }

                {// Edit avatar
                page === "avatar" && 
                <div className="h-full flex flex-col gap-4">
                    <div className="self-center">
                    <Avatar
                    loading={profileLoading}
                    outline={true}
                    size={24}
                    profile={
                        {
                            name: inputName,
                            icon: inputIcon,
                            color_primary: inputColor1,
                            color_secondary: inputColor2,
                            created_at: ""
                        }
                    }
                    />
                    </div>
                    <div>
                    <p className="text-2xl font-bold">Icon</p>
                    <div className="flex flex-row gap-2 flex-wrap">
                    {Object.entries(AVATAR_ICONS).map(([key, Icon], idx) => (
                        <div
                        key={key}
                        className="w-8 h-8 bg-primary/5 flex justify-center items-center rounded-full cursor-pointer"
                        onClick={() => {
                            setInputIcon(key)
                        }}
                        >
                            <Icon />
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
                        className={clsx(
                            "select-none mt-6 flex flex-row gap-1 justify-center items-center bg-primary/5 transition-colors py-2 rounded-md",
                            saveAvatarDisabled ? "opacity-50" : "cursor-pointer hover:bg-primary/10"
                        )}
                        onClick={handleSaveAvatar}
                        disabled={saveAvatarDisabled}
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