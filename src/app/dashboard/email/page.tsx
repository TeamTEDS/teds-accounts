"use client"

import { useHeader } from "@/app/context/header-context";
import { EmailRequestsTable } from "@/components/email-requests-table";
import { useEffect } from "react";

export default function EmailPage() {
    const { setTitle } = useHeader();

    useEffect(() => {
        setTitle("Email Settings");
    }), [setTitle];

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {/* <SectionCards /> */}
                    <div className="px-4 lg:px-6">
                        <section id="emails">
                            <header>Your TEDS Emails</header>
                        </section>
                        <br></br>
                        <section id="email-requests">
                            <header className="mb-3 block">Your Email Requests</header>
                            <EmailRequestsTable />
                        </section>
                    </div>
                {/* <DataTable data={data} /> */}
                </div>
            </div>  
        </div>
    );  
}