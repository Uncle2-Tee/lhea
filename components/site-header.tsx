"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/ui";

const navigation = [
  { label: "Nominee registration", href: "/register" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <Brand />
      <button
        className="site-menu-button"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close site navigation" : "Open site navigation"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav className={`site-navigation ${menuOpen ? "site-navigation-open" : ""}`} aria-label="Site navigation">
        {navigation.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`site-navigation-link ${isActive(href) ? "site-navigation-link-active" : ""}`}
            aria-current={isActive(href) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/categories"
          className="button button-dark button-compact site-browse-button"
          aria-current={pathname.startsWith("/categories") || pathname.startsWith("/nominees") ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          Browse nominees
        </Link>
      </nav>
    </header>
  );
}
