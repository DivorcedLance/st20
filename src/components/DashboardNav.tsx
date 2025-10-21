"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { User } from "@/types";

interface DashboardNavProps {
  user: User;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Inicio" },
    { href: "/dashboard/courses", label: "Cursos" },
    { href: "/dashboard/topics", label: "Temas" },
    { href: "/dashboard/questions", label: "Preguntas" },
    { href: "/dashboard/exam", label: "Generar Examen" },
    { href: "/dashboard/settings", label: "Configuración" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-white">
              ST20
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.name || user.email || "Usuario"}
            </span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Cerrar Sesión
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="px-4 text-sm text-gray-600 dark:text-gray-300">
                {user.name || user.email || "Usuario"}
              </div>
              <form action={logout} className="px-4">
                <Button type="submit" variant="outline" size="sm" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
