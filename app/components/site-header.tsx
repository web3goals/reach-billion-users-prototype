"use client";

import { siteConfig } from "@/config/site";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-primary font-bold">
              {siteConfig.emoji} <span>{siteConfig.name}</span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="text-sm font-medium text-muted-foreground"
              asChild
            >
              <Button variant="outline" size="icon">
                <MenuIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/dashboard">
                <DropdownMenuItem>🪄 Dashboard</DropdownMenuItem>
              </Link>
              {/* TODO: Use real link to documentation */}
              <Link
                href={`${siteConfig.links.github}/blob/main/README.md`}
                target="_blank"
              >
                <DropdownMenuItem>📄 Docs</DropdownMenuItem>
              </Link>
              <Link href="/cryptospaceprison" target="_blank">
                <DropdownMenuItem>🚀 Demo</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href={siteConfig.links.github} target="_blank">
                <DropdownMenuItem>🔗 GitHub</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
