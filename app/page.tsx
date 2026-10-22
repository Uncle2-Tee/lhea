import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  CirclePlay,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { Brand } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="hero-overline"><span /> THE LHEA AWARDS · 2026</p>
          <h1>Great work deserves <span>your vote.</span></h1>
          <p className="hero-description">Celebrate the artists, creators, and storytellers making a difference. Discover the nominees and help decide who takes home the honour.</p>
          <div className="hero-actions">
            <Link href="/categories" className="button button-primary button-large">Explore the nominees <ArrowRight size={17} /></Link>
            <Link href="/dashboard" className="text-link"><CirclePlay size={17} /> How voting works</Link>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars" aria-hidden="true"><i>K</i><i>S</i><i>A</i><i>+</i></div>
            <span><strong>A platform for the people</strong><br />Your voice. Your awards.</span>
          </div>
        </div>

        <div className="hero-art" aria-label="LHEA awards illustration">
          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="art-glow" />
          <div className="art-stamp"><Sparkles size={14} /> THE PEOPLE&apos;S CHOICE</div>
          <div className="trophy-stage">
            <div className="trophy-halo"><Trophy size={118} strokeWidth={1.1} /></div>
            <div className="trophy-pedestal"><span>EXCELLENCE</span></div>
          </div>
          <div className="art-footnote"><span>01 / 06</span><span>CELEBRATING WHAT MOVES US</span></div>
          <div className="floating-award-card">
            <span className="floating-star"><Star size={16} fill="currentColor" /></span>
            <span><strong>The next winner?</strong><small>That&apos;s up to you.</small></span>
            <ArrowDownRight size={19} />
          </div>
        </div>
      </section>

      <section className="landing-stats" aria-label="Awards at a glance">
        <div><strong>06</strong><span>award categories</span></div>
        <div><strong>OPEN</strong><span>voting status</span></div>
        <div><strong>YOU</strong><span>choose the winners</span></div>
        <div className="stats-note"><span className="status-dot" /> Season 2026 is now open</div>
      </section>

      <footer className="landing-footer">
        <Brand />
        <span>Made for celebrating talent.</span>
        <Link href="/categories">Browse award categories <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
