"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 text-xl font-semibold tracking-tight">{title}</h1>
      <Avatar className="h-9 w-9">
        <AvatarImage src="https://picsum.photos/100" alt="Avatar" data-ai-hint="researcher headshot" />
        <AvatarFallback>RS</AvatarFallback>
      </Avatar>
    </header>
  );
}
