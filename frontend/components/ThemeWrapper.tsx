"use client";

import { useTheme } from "next-themes";
import Navbar from "./navbar";
import { ReactNode, useEffect, useState } from "react";

export default function ThemeWrapper({ children }: { children: ReactNode }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            <Navbar localTheme={resolvedTheme as "light" | "dark"} setLocalTheme={setTheme} />
            <div className="bg-background h-full " >
                {children}
            </div>
        </>
    )
}