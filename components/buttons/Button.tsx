import clsx from "clsx";

export function Button(
    {
        text,
        color="white", 
        hover="white",
    }:{
        text: string, 
        color?: "white" | "green" | "red", 
        hover?: "white" | "green" | "red",
    }
) {

    return (
        <div 
        className={clsx(
            "relative flex-1 rounded-full px-6 py-1 text-center hover:-translate-y-[2px] transition-all cursor-pointer overflow-hidden",
            color === "green"
            ? "bg-accent text-secondary"
            : color === "red"
                ? "bg-red-500 text-primary"
                : "bg-primary text-secondary",
            
            hover === "green"
            ? "hover:bg-accent hover:text-secondary"
            : hover === "red"
                ? "hover:bg-red-500 hover:text-primary"
                : hover === "white" 
                    ? "hover:bg-primary hover:text-secondary"
                    : "",
        )}
        >
            <div className="w-full h-full absolute left-0 top-0 bg-linear-0 from-black/25 to-transparent from-10% to-75%"></div>
            <p className="font-bold text-3xl uppercase">{text}</p>
        </div>
    )
}