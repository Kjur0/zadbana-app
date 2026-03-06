"use client"

import { LoginForm } from "@/components/login-form"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    async function handleLogin(e: React.SubmitEvent) {
        e.preventDefault();

        const { email, password } = {
            email: (document.getElementById('email') as HTMLInputElement)?.value.toString(),
            password: (document.getElementById('password') as HTMLInputElement)?.value.toString(),
        }

        if (email != undefined && password != undefined)
            try {
                await signInWithEmailAndPassword(auth, email, password);
                router.push("/dashboard")
            } catch (err: any) {
            }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm onSubmit={handleLogin} />
            </div>
        </div>
    )
}
