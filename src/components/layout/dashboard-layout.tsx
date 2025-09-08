"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebar, main] = React.Children.toArray(children);

  return (
    <SidebarProvider>
        {sidebar}
        <SidebarInset>{main}</SidebarInset>
    </SidebarProvider>
  );
}
