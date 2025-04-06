"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/constants/webcontent";

export function NavHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="font-semibold text-xl text-primary flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path>
            <path d="M14 2v6h6"></path>
            <path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z"></path>
            <path d="m2 14 6 6"></path>
            <path d="m8 14-6 6"></path>
          </svg>
          {siteConfig.name}
        </Link>

        {/* desktop navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/features/content-generation"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-secondary to-secondary p-6 no-underline outline-none focus:shadow-md"
                          onClick={closeMenu}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-primary">
                            Content Generation
                          </div>
                          <p className="text-sm leading-tight text-primary/80">
                            Create professional content tailored to your writing
                            style
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/features/style-analysis"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-secondary to-secondary p-6 no-underline outline-none focus:shadow-md"
                          onClick={closeMenu}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-primary">
                            Style Analysis
                          </div>
                          <p className="text-sm leading-tight text-primary/80">
                            Our AI learns your unique writing style through
                            detailed profiling
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="lg:col-span-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/features/enterprise"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary to-primary p-6 no-underline outline-none focus:shadow-md"
                          onClick={closeMenu}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-primary-foreground">
                            Enterprise Solutions
                          </div>
                          <p className="text-sm leading-tight text-primary-foreground/80">
                            Unified brand voice, team collaboration, and
                            advanced analytics for your entire organization
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={closeMenu}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
            <Button className="bg-primary hover:bg-primary/90">
              <Link href="/profile">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* mobile navigation menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden py-4 px-4 bg-background border-b border-border"
        >
          <div className="flex flex-col space-y-4">
            <Link
              href="/features"
              className={cn(
                "px-4 py-2 rounded-md",
                pathname === "/features"
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-secondary/50"
              )}
              onClick={closeMenu}
            >
              Features
            </Link>
            <Link
              href="/about"
              className={cn(
                "px-4 py-2 rounded-md",
                pathname === "/about"
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-secondary/50"
              )}
              onClick={closeMenu}
            >
              About
            </Link>

            <div className="pt-2 border-t border-border">
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 block"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                href="/profile"
                className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 block text-center"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
