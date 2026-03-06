"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { auth, db, getUserData } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            getUserData().catch((e) => console.error(e))
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);

    if (loading)
        return <Skeleton className="h-max w-max" />

    if (!user) {
        router.push("/auth/login")
        return <></>
    }

    return (
        <div>
            <h1>Welcome, {user.displayName || user.email}!</h1>
            <p>User ID: {user.uid}</p>
            {/* Display other user data as needed */}
        </div>
    );
};