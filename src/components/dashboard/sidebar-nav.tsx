"use client";

import { useDataStore } from "@/hooks/use-data-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ActivitySquare, Home, BarChart2, Users, AppWindow, LogOut } from "lucide-react";

interface SidebarNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function SidebarNav({ activeView, setActiveView }: SidebarNavProps) {
  const { setData } = useDataStore();

  const handleLogout = () => {
    setData(null);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "time-series", label: "Time Series", icon: BarChart2 },
    { id: "correlation", label: "Correlation", icon: AppWindow },
    { id: "cohorts", label: "Cohorts", icon: Users },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <ActivitySquare className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold">Adherence Explorer</h2>
                <p className="text-xs text-muted-foreground">v1.0 Session</p>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveView(item.id)}
                isActive={activeView === item.id}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} variant="outline">
                    <LogOut/>
                    <span>End Session</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <p className="px-3 text-xs text-muted-foreground">
          All data is processed in your browser and is deleted when you close this tab.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
