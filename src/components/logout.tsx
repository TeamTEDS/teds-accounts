"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import authClient from "@/auth/authClient";
import * as React from "react";
import { useRouter } from 'next/navigation'

export function Logout() {

    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = React.useState(true);
    React.useEffect(() => {
        handleLogout();
    }, []);
    async function handleLogout() {
        
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    console.log("Logout successful");
                    setIsLoggingOut(false);
                    setTimeout(() => {
                        router.push("/");
                    }, 3000); // Redirect after 3 seconds
                }
            }
        })
    }


    return (
        <Card>
            <CardHeader>

                {isLoggingOut ? (
                        <>
                            <div className="flex gap-4">
                                <CardTitle>Logging out</CardTitle>
                                <div className="ml-auto"><Spinner /></div>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4">
                                <CardTitle>Logged out</CardTitle>
                                <div className="ml-auto"></div>
                            </div>
                    )}
                
                
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    {isLoggingOut ? (
                        <>
                            <p>You are being logged out...</p>
                        </>
                    ) : (
                        <p>You have been logged out.</p>
                    )}
                    
                </div>
            </CardContent>
        </Card>
    );
}