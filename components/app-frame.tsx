"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  Home,
  Menu,
  ReceiptText,
  Sparkles,
  Star,
  Ticket,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useDemoState } from "@/components/demo-provider";
import { Brand } from "@/components/ui";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Categories", href: "/categories", icon: Star },
  { label: "My votes", href: "/votes", icon: ClipboardList },
  { label: "Voting codes", href: "/codes", icon: Ticket },
  { label: "Results", href: "/results", icon: BarChart3 },
];

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, error } = useDemoState();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <div className="sidebar-brand"><Brand /></div>
        <div className="season-label">2026 AWARDS</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {label === "Voting codes" && state.codes.some((code) => code.remaining > 0) ? (
                  <span className="nav-count">{state.codes.reduce((total, code) => total + code.remaining, 0)}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><Sparkles size={16} /></span>
            <p>Every vote makes a difference.</p>
            <Link href="/categories">Explore nominees <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            <Menu size={20} />
          </button>
          <div className="topbar-context">
            <span className="status-dot" />
            Voting is open <span className="topbar-divider">·</span> Season 2026
          </div>
          <div className="topbar-actions">
            <Link href="/payment" className="button button-dark button-compact">
              <CreditCard size={15} /> Get votes
            </Link>
          </div>
        </header>

        {menuOpen ? (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            {navigation.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                <Icon size={17} /> {label}
              </Link>
            ))}
            <Link href="/payment" onClick={() => setMenuOpen(false)}><ReceiptText size={17} /> Buy votes</Link>
            <Link href="/results" onClick={() => setMenuOpen(false)}><Trophy size={17} /> Results</Link>
          </nav>
        ) : null}

        <main className="workspace">
          <div className="workspace-content">
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            {children}
          </div>
        </main>

        <nav className="mobile-tabbar" aria-label="Quick navigation">
          {[
            { label: "Home", href: "/dashboard", icon: Home },
            { label: "Categories", href: "/categories", icon: Star },
            { label: "My votes", href: "/votes", icon: ClipboardList },
            { label: "Results", href: "/results", icon: BarChart3 },
          ].map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={active ? "mobile-tab-active" : ""}>
                <Icon size={19} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
