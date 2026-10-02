import clsx from "clsx";
import { Ref } from "react";

export function Button(
    {
        text,
        color="white", 
        hover="white",
        onClick,
        disabled,
        ref,
        children,
    }:{
        text: string, 
        color?: "white" | "green" | "red", 
        hover?: "white" | "green" | "red",
        onClick?: () => void,
        disabled?: boolean,
        ref?: Ref<HTMLButtonElement>
        children?: React.ReactNode;
    }
) {

    return (
        <button
        ref={ref}
        disabled={disabled} 
        onClick={onClick}
        className={clsx(
            "relative flex-1 rounded-full px-6 py-1 text-center  transition-all overflow-hidden",
            disabled
            ? "bg-primary/15 text-primary opacity-50"
            : color === "green"
                ? "bg-accent text-secondary"
                : color === "red"
                    ? "bg-red-500 text-primary"
                    : "bg-primary text-secondary",

            !disabled && "hover:-translate-y-[2px] cursor-pointer",
            
            disabled
            ? ""
            : hover === "green"
                ? "hover:bg-accent hover:text-secondary"
                : hover === "red"
                    ? "hover:bg-red-500 hover:text-primary"
                    : hover === "white" 
                        ? "hover:bg-primary hover:text-secondary"
                        : "",
        )}
        >
            <div className="w-full h-full absolute left-0 top-0 bg-linear-0 from-black/25 to-transparent from-10% to-75%"></div>
            <div className="font-bold text-3xl uppercase">{children ? children : text}</div>
        </button>
    )
}