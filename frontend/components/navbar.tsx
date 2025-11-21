'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import ThemeSwitch from "@/components/ui/theme-switch";
import { cn } from "@/lib/utils";
import { PanelsTopLeft, Info, HomeIcon, Newspaper } from "lucide-react";

interface User {
    firstName: string;
    lastName: string;
    email: string;
}

interface HomeHeaderProps {
    localTheme: "light" | "dark";
    setLocalTheme: (theme: "light" | "dark") => void;
}

const Navbar = ({
    localTheme,
    setLocalTheme,
}: HomeHeaderProps
) => {

    const navItems = [
        { href: "/", label: "Home", icon: HomeIcon },
        { href: "/cards", label: "Cards", icon: PanelsTopLeft },
        { href: "/about", label: "About", icon: Info },
        { href: "/blog", label: "Blogs", icon: Newspaper },
    ];

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkUserAuth = async () => {
            const profile = await authApi.checkAuth();

            setIsAuthenticated(profile);
            if (profile) {
                try {
                    const response = await authApi.getProfile();
                    setUser(response.data);
                } catch (err) {
                    console.error('Error fetching profile:', err);
                    setUser(null);
                }
            }
        };

        checkUserAuth();
    }, [])

    const handleLogout = async () => {
        try {
            await authApi.logout();
            setUser(null);
            setIsAuthenticated(false);
            router.push('/user/login');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };


    return (
        <>
            <header className="w-full top-0 z-10 absolute lg:z-10 flex items-center lg:px-8 lg:py-0 text-primary-foreground">
                <div className="flex md:max-w-5xl mx-auto w-full items-center justify-between h-16 px-4 p-2 bg-white border dark:border-neutral-800 border-neutral-200 rounded-b-xl dark:bg-zinc-950">
                    <nav className="flex gap-2 items-center font-medium">
                        <a href="/" className="flex items-center pl-2">
                            <div className="text-zinc-950 dark:text-white flex gap-2 items-center">
                                <div className="text-3xl text-[#0063f7] font-mono font-semibold">
                                    Former.
                                </div>
                            </div>
                        </a>

                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "cursor-pointer rounded-md transition-colors duration-200 flex items-center justify-center gap-1 select-none p-2 text-black   dark:hover:text-blue-200  hover:text-base-blue  dark:border dark:border-blue-950 dark:text-neutral-200  dark:bg-neutral-900 bg-neutral-200 "
                                )}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <nav className="flex items-center gap-2">

                        <ThemeSwitch
                            localTheme={localTheme}
                            setLocalTheme={setLocalTheme}
                            className="border w-10 rounded-md h-10 dark:text-white text-black dark:border-neutral-800 border-neutral-200"
                        />
                        <div
                            className="bg-[#334cec] text-white border dark:border-neutral-800 border-neutral-200 h-10 items-center flex justify-center px-3 rounded-md"
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    {isAuthenticated && user ? (
                                        <span className="flex items-center gap-2">
                                            <span className="font-medium px-4 py-0.5">{user.firstName}</span>
                                        </span>
                                    ) : (
                                        "Sign In"
                                    )}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {isAuthenticated && user ? (
                                        <>
                                            <DropdownMenuLabel>
                                                {user.firstName} {user.lastName}
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Link href="/user/profile" className="w-full">Profile</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleLogout}>
                                                Logout
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem>
                                                <Link href="/user/login" className="w-full">Login</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Link href="/user/register" className="w-full">Sign Up</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </nav>
                </div>
            </header >

        </>
    )

}
export default Navbar