'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            console.log("auth checnk calllll");
            const authenticated = await authApi.checkAuth();
            setIsAuthenticated(authenticated);

            setIsLoading(false);
            if (!authenticated) {
                router.push('/user/login');
            }
        };
        check();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center space-x-4 pt-34 justify-center ">
                <Skeleton className="h-19 w-19 rounded-full " />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default AuthCheck;
