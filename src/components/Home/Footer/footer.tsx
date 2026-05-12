import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

import { cn } from "@/lib/utils";

interface Footer7Props {
  logo?: {
    title: string;
  };
  className?: string;
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Explore",
    links: [
      { name: "Home", href: "/" },
      { name: "Events", href: "/events" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Login", href: "/login" },
      { name: "Register", href: "/register" },
      { name: "My Events", href: "/my-events" },
      { name: "My Invitations", href: "/pending-invitations" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Profile", href: "/profile" },
      { name: "Reviews", href: "/my-reviews" },
      { name: "Participants", href: "/event-participants" },
      { name: "Create Event", href: "/add-events" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Footer = ({
  logo = {
    title: "Planora",
  },
  sections = defaultSections,
  description = "Discover, create, and manage events with a smoother planning experience.",
  socialLinks = defaultSocialLinks,
  copyright = "Copyright 2026 Planora. All rights reserved.",
  legalLinks = defaultLegalLinks,
  className,
}: Footer7Props) => {
  return (
    <section className={cn("py-20", className)}>
      <div className="container">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <Link href="/" className="inline-flex items-center gap-2 lg:justify-start">
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </Link>

            <p className="max-w-md text-sm text-muted-foreground">
              {description}
            </p>

            <ul className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {socialLinks.map((social) => (
                <li key={social.label} className="flex items-center gap-2 font-medium">
                  {social.icon}
                  <span className="text-sm">{social.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.href} className="font-medium hover:text-primary">
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-4">
            {legalLinks.map((link) => (
              <li key={link.href} className="hover:text-primary">
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { Footer };
