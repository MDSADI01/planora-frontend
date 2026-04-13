"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./themeToggle";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const isOverlayNav = className?.includes("text-white");
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "About", href: "/about" },
  ];

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <p className="ml-6 text-4xl">Planora</p>
          </Link>

          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList className="gap-5">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isOverlayNav &&
                        "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white focus:bg-white/25 focus:text-white data-[state=open]:bg-white/25"
                    )}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden items-center gap-4 mr-6 lg:flex">
            <ThemeToggle
              className={cn(
                isOverlayNav &&
                  "border-white/60 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              )}
            />

            <Link href="/login">
              <Button
                variant="outline"
                className={cn(
                  isOverlayNav &&
                    "border-white/60 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                )}
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                className={cn(
                  isOverlayNav &&
                    "bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                )}
              >
                Register Now
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  isOverlayNav &&
                    "border-white/60 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                )}
              >
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Planora</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-medium hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-3">
                  <ThemeToggle />
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full">Register Now</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

export { Navbar };
