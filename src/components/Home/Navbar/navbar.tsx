import { LayoutDashboard, LogOut, MenuIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
    ) as { role?: string; userRole?: string; image?: string; name?: string };

    return {
      role: data.role || data.userRole,
      image: data.image,
      name: data.name,
    };
  } catch {
    return undefined;
  }
};

const Navbar = async ({ className }: NavbarProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const isLoggedIn = Boolean(accessToken);
  const userData = getRoleFromToken(accessToken);
  const role = userData?.role;
  const userImage = userData?.image;
  const userName = userData?.name;
  const dashboardHref = role === "ADMIN" ? "/adminProfile" : "/profile";
  const isOverlayNav = className?.includes("text-white");
  const navLinks = isLoggedIn
    ? [
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
        { label: "My Events", href: "/my-events" },
        { label: "My Invitations", href: "/pending-invitations" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 shadow-[0_2px_20px_rgba(0,0,0,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-background/60 py-3 transition-all duration-500",
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between gap-3">
          {/* Brand/Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]">
            <span
              className={cn(
                "text-2xl font-black tracking-tight ml-1",
                isOverlayNav
                  ? "text-white"
                  : "bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/70"
              )}
            >
              Planora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden xl:flex min-w-0 flex-1 justify-center">
            <NavigationMenuList className="gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "relative text-sm font-medium transition-colors bg-transparent",
                      "text-foreground/70 hover:text-foreground",
                      "hover:bg-muted/50 data-[state=open]:bg-muted/50",
                      "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-indigo-600 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100",
                      isOverlayNav &&
                        "text-white/80 hover:bg-white/10 hover:text-white after:bg-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10"
                    )}
                  >
                    <Link href={link.href} className="px-2 py-2 xl:px-4">
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Actions */}
          <div className="hidden items-center gap-4 xl:flex">
            <ThemeToggle
              className={cn(
                "rounded-full border-border/50 hover:bg-muted transition-colors",
                isOverlayNav &&
                  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              )}
            />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-indigo-500/50 transition-all p-0">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={userImage} alt={userName || "User"} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 text-indigo-700 dark:text-indigo-300 font-medium">
                        {userName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 p-2 rounded-xl border-border/50 shadow-xl" align="end" forceMount>
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userImage} alt={userName || "User"} />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium">
                        {userName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-semibold leading-none">{userName || "User"}</p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {role === "ADMIN" ? "Administrator" : "Member"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-950/50 dark:focus:text-indigo-300 transition-colors">
                    <Link href={dashboardHref} className="flex items-center py-2">
                      <LayoutDashboard className="mr-3 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors">
                    <form action={logoutAction} className="w-full">
                      <button type="submit" className="flex w-full items-center py-2">
                        <LogOut className="mr-3 h-4 w-4" />
                        Log Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "font-medium rounded-full px-5 hover:bg-muted/50 transition-colors",
                      isOverlayNav && "text-white hover:bg-white/10 hover:text-white"
                    )}
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className={cn(
                      "font-medium rounded-full px-6 shadow-[0_4px_14px_0_rgb(79,70,229,39%)] hover:shadow-[0_6px_20px_rgba(79,70,229,23%)] hover:bg-indigo-600 bg-indigo-500 text-white transition-all hover:-translate-y-0.5",
                      isOverlayNav &&
                        "bg-white text-black shadow-white/20 hover:bg-white/90"
                    )}
                  >
                    Register Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger
              className={cn(
                "xl:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm transition-colors",
                "hover:bg-muted hover:text-foreground",
                isOverlayNav &&
                  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              )}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 border-l border-border/50 bg-background/95 backdrop-blur-xl p-0">
              <SheetHeader className="p-6 border-b border-border/40 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight">Planora</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-[calc(100vh-5rem)] overflow-y-auto">
                <div className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-3 rounded-xl font-medium text-foreground/80 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-auto p-6 border-t border-border/40 bg-muted/20">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                    <ThemeToggle className="rounded-full" />
                  </div>
                  
                  {isLoggedIn ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 p-4 bg-background border border-border/50 rounded-2xl shadow-sm">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                          <AvatarImage src={userImage} alt={userName || "User"} />
                          <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium text-lg">
                            {userName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{userName || "User"}</p>
                          <p className="text-xs text-muted-foreground font-medium">{role === "ADMIN" ? "Administrator" : "Member"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link href={dashboardHref} className="w-full">
                          <Button variant="outline" className="w-full rounded-xl border-border/50 h-12">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <form action={logoutAction} className="w-full">
                          <Button type="submit" variant="destructive" className="w-full rounded-xl shadow-sm hover:shadow h-12">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                          </Button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full rounded-xl h-12 border-border/50 font-semibold">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button className="w-full rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/20">
                          Register Now
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export { Navbar };
