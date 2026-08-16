"use client";
import { SignupForm } from "@/components/signup-form";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm -translate-y-4 flex-col gap-8">
        <a href="https://teds.one" className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/teds/white-text.svg"
            alt="TEDS Logo"
            width={256}
            height={64}
            className="h-14 w-auto"
            loading="eager"
          />
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
