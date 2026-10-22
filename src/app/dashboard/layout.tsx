"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HeaderProvider } from "@/app/context/header-context";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    // <SidebarProvider>
    //   <AppSidebar variant="inset" />
    //   <SidebarInset>
    //     <SiteHeader />
    //     <div className="flex flex-1 flex-col">
    //       <div className="@container/main flex flex-1 flex-col gap-2">
    //         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    //           <SectionCards />
    //           <div className="px-4 lg:px-6">
    //             <ChartAreaInteractive />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </SidebarInset>
    // </SidebarProvider>
    
    <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <HeaderProvider>
              <SiteHeader />
              {children}
          </HeaderProvider>
        </SidebarInset>
    </SidebarProvider>
  );
}