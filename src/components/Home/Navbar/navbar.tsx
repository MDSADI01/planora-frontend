import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

import { logoutAction } from "@/src/app/(CommonLayout)/action/auth";
import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";

interface NavbarProps {
  className?: string;
}

const getRoleFromToken = (token?: string) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return undefined;

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { role?: string; userRole?: string };

    return data.role || data.userRole;
  } catch {
    return undefined;
  }
};

const Navbar = async ({ className }: NavbarProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isLoggedIn = Boolean(accessToken);
  const role = getRoleFromToken(accessToken);
  console.log("=== Cookie Data ===");
  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);
  console.log("isLoggedIn:", isLoggedIn);
  console.log("role:", role);
  console.log("===================");
  const dashboardHref = role === "ADMIN" ? "/adminProfile" : "/profile";
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

            {isLoggedIn ? (
              <>
                <Link href={dashboardHref}>
                  <Button
                    variant="outline"
                    className={cn(
                      isOverlayNav &&
                        "border-white/60 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    )}
                  >
                    Dashboard
                  </Button>
                </Link>
                <form action={logoutAction}>
                  <Button
                    type="submit"
                    className={cn(
                      isOverlayNav &&
                        "bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    )}
                  >
                    Log Out
                  </Button>
                </form>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger
              className={cn(
                "lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background",
                "hover:bg-muted hover:text-foreground",
                isOverlayNav &&
                  "border-white/60 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              )}
            >
              <MenuIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
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
                  {isLoggedIn ? (
                    <>
                      <Link href={dashboardHref}>
                        <Button variant="outline" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                      <form action={logoutAction}>
                        <Button type="submit" className="w-full">
                          Log Out
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full">Register Now</Button>
                      </Link>
                    </>
                  )}
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
