import Link from "next/link";
import { ArrowRight, Star, type LucideIcon } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="LHEA home">
      <span className={`brand-mark ${light ? "brand-mark-light" : ""}`}>
        <Star size={18} fill="currentColor" strokeWidth={1.7} />
      </span>
      <span>
        <span className={`brand-name ${light ? "text-white" : ""}`}>LHEA</span>
        <span className={`brand-caption ${light ? "text-white/55" : ""}`}>AWARDS · VOTING</span>
      </span>
    </Link>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  icon: Icon = ArrowRight,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "dark";
}) {
  return (
    <Link href={href} className={`button button-${variant}`}>
      {children}
      <Icon size={16} aria-hidden="true" />
    </Link>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon size={22} /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
