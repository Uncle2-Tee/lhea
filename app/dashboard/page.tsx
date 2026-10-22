import Link from "next/link";
import { ArrowRight, ChevronRight, CircleHelp, Sparkles, Star, Trophy } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { DashboardMetrics } from "@/components/account-panels";
import { PageHeading } from "@/components/ui";
import { categories } from "@/lib/election-data";

const recentNominees = categories[0].nominees.slice(0, 3);

export default function DashboardPage() {
  return (
    <AppFrame>
      <PageHeading
        eyebrow="VOTER WORKSPACE"
        title="Welcome to the awards."
        description="Explore the nominees, get a voting code, and support your favourites."
      />

      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="hero-tag"><Sparkles size={14} /> SEASON 2026 IS OPEN</span>
          <h2>Who gets your vote?</h2>
          <p>Six categories. A whole lot of talent. Take a look around and make your picks count.</p>
          <Link href="/categories" className="button button-gold">Browse the nominees <ArrowRight size={16} /></Link>
        </div>
        <div className="dashboard-hero-art">
          <div className="dashboard-art-circle"><Trophy size={78} strokeWidth={1.1} /></div>
          <span className="dashboard-art-label">YOUR VOICE, THEIR MOMENT</span>
          <span className="dashboard-art-orbit" />
        </div>
      </section>

      <DashboardMetrics />

      <section className="dashboard-section">
        <div className="section-heading-row section-heading-compact">
          <div><p className="eyebrow">START HERE</p><h2>Explore categories</h2></div>
          <Link className="text-link" href="/categories">View all <ArrowRight size={15} /></Link>
        </div>
        <div className="workspace-category-grid">
          {categories.slice(0, 3).map((category, index) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="workspace-category-card">
              <span className={`category-number category-number-${index + 1}`}>0{index + 1}</span>
              <span className="workspace-category-icon"><Star size={18} /></span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="card-link">{category.nominees.length} nominees <ChevronRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="panel">
          <div className="panel-heading"><div><p className="eyebrow">IN THE SPOTLIGHT</p><h2>Featured nominees</h2></div><Trophy size={18} /></div>
          <div className="featured-list">
            {recentNominees.map((nominee, index) => (
              <Link href={`/nominees/${nominee.id}`} className="featured-row" key={nominee.id}>
                <span className="nominee-avatar" style={{ backgroundColor: nominee.accent }}>{nominee.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                <span className="featured-name"><strong>{nominee.name}</strong><small>Best Artist · Sample nominee</small></span>
                <span className="featured-rank">0{index + 1}</span>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        </div>
        <div className="panel quick-panel">
          <span className="quick-icon"><CircleHelp size={20} /></span>
          <p className="eyebrow">FIRST TIME HERE?</p>
          <h2>Everything you need to know.</h2>
          <p>Browse freely. Voting codes are generated in preview mode without taking payment, and no voter account is needed.</p>
          <Link href="/categories" className="text-link">Start exploring <ArrowRight size={15} /></Link>
        </div>
      </section>
    </AppFrame>
  );
}
