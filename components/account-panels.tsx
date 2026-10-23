"use client";

import Link from "next/link";
import { ArrowRight, Check, Copy, Star, Ticket, Trophy } from "lucide-react";
import { useState } from "react";
import { useDemoState } from "@/components/demo-provider";
import { categories, getNominee } from "@/lib/election-data";

export function DashboardMetrics() {
  const { state, ready } = useDemoState();
  const votesAvailable = state.codes.reduce((total, code) => total + code.remaining, 0);
  return (
    <section className="metric-grid" aria-label="Your voting activity">
      <article className="metric-card">
        <span className="metric-icon metric-violet"><Star size={18} /></span>
        <span className="metric-label">Categories</span>
        <strong>06</strong>
        <span className="metric-foot">Ready to explore</span>
      </article>
      <article className="metric-card">
        <span className="metric-icon metric-gold"><Ticket size={18} /></span>
        <span className="metric-label">Votes available</span>
        <strong>{ready ? votesAvailable : "—"}</strong>
        <span className="metric-foot">Get a code to begin</span>
      </article>
      <article className="metric-card">
        <span className="metric-icon metric-green"><Trophy size={18} /></span>
        <span className="metric-label">Your votes cast</span>
        <strong>{ready ? state.votes.length : "—"}</strong>
        <span className="metric-foot">Your activity is private</span>
      </article>
      <article className="metric-card metric-summary">
        <span className="metric-icon metric-ink"><Ticket size={18} /></span>
        <span className="metric-label">Voting codes</span>
        <strong>Preview packs</strong>
        <span className="metric-foot">Free in preview mode</span>
      </article>
    </section>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

export function MyVotesPanel() {
  const { state, ready, error } = useDemoState();

  if (!ready) return <div className="loading-panel">Loading your demo activity…</div>;
  if (error) return <div className="form-error" role="alert">{error}</div>;
  if (state.votes.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><Ticket size={22} /></span>
        <h2>Your ballot starts here.</h2>
        <p>Once you have a voting code, you can cast a vote in any category and see your activity here.</p>
        <Link href="/categories" className="button button-primary">Explore categories <ArrowRight size={15} /></Link>
      </div>
    );
  }

  return (
    <div className="activity-list">
      {state.votes.map((vote) => {
        const details = getNominee(vote.nomineeId, state.registeredNominees);
        if (!details) return null;
        return (
          <article className="activity-row" key={vote.id}>
            <span className="activity-vote-mark">✓</span>
            <div className="activity-copy">
              <strong>{details.nominee.name}</strong>
              <span>{details.category.name} · {vote.codeId.slice(0, 8)}</span>
            </div>
            <time dateTime={vote.createdAt}>{formatDate(vote.createdAt)}</time>
          </article>
        );
      })}
    </div>
  );
}

export function VoteConfirmationPanel() {
  const { state, ready, error } = useDemoState();
  if (!ready) return <div className="loading-panel">Loading your ballot confirmation…</div>;
  if (error) return <div className="form-error" role="alert">{error}</div>;

  const vote = state.votes[0];
  const details = vote ? getNominee(vote.nomineeId, state.registeredNominees) : undefined;
  if (!vote || !details) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><Ticket size={22} /></span>
        <h2>No vote to confirm.</h2>
        <p>Cast a vote from an award category to see its confirmation here.</p>
        <Link href="/categories" className="button button-primary">Explore categories <ArrowRight size={15} /></Link>
      </div>
    );
  }

  return (
    <section className="vote-confirmation-card">
      <div className="vote-confirmation-check"><Check size={28} /></div>
      <span className="eyebrow">YOUR VOICE HAS BEEN COUNTED</span>
      <h1>Vote recorded.</h1>
      <p className="vote-confirmation-lede">Thanks for supporting excellence at the LHEA Awards.</p>
      <div className="vote-confirmation-details">
        <div><span>Nominee</span><strong>{details.nominee.name}</strong></div>
        <div><span>Category</span><strong>{details.category.name}</strong></div>
        <div><span>Code used</span><strong>{state.codes.find((code) => code.id === vote.codeId)?.value ?? "Demo voting code"}</strong></div>
        <div><span>Recorded</span><strong>{formatDate(vote.createdAt)}</strong></div>
      </div>
      <span className="local-only-tag">DEMO VOTE · STORED IN THIS BROWSER</span>
    </section>
  );
}

export function VotingCodesPanel() {
  const { state, ready, error } = useDemoState();
  const [copiedId, setCopiedId] = useState("");
  const [copyError, setCopyError] = useState("");

  async function copyCode(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      setCopyError("");
    } catch {
      setCopyError("Copy was blocked by your browser. Select the code and copy it manually.");
    }
  }

  if (!ready) return <div className="loading-panel">Loading your demo codes…</div>;
  if (error) return <div className="form-error" role="alert">{error}</div>;
  if (state.codes.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><Ticket size={22} /></span>
        <h2>No codes yet.</h2>
        <p>Create a free demo voting code to try the full ballot flow. No payment provider is connected.</p>
        <Link href="/payment" className="button button-primary">Create a demo code <ArrowRight size={15} /></Link>
      </div>
    );
  }

  return (
    <>
      <div className="code-list">
        {state.codes.map((code) => (
          <article className="code-card" key={code.id}>
            <div className="code-card-icon"><Ticket size={19} /></div>
            <div className="code-card-main">
              <span className="eyebrow">DEMO VOTING CODE</span>
              <code>{code.value}</code>
              <span className="code-created">Created {formatDate(code.createdAt)}</span>
            </div>
            <div className="code-balance"><strong>{code.remaining}<small> / {code.total}</small></strong><span>votes remaining</span></div>
            <button className="icon-button" type="button" onClick={() => copyCode(code.id, code.value)} aria-label={`Copy code ${code.value}`}>
              <Copy size={16} />
            </button>
            <span className={`code-status ${code.remaining > 0 ? "code-status-active" : ""}`}>{code.remaining > 0 ? "Ready to use" : "Used"}</span>
          </article>
        ))}
      </div>
      {copyError ? <p className="form-error" role="alert">{copyError}</p> : null}
      {copiedId ? <p className="inline-success" role="status">Voting code copied.</p> : null}
    </>
  );
}

export function ResultsPanel() {
  const { state, ready, error } = useDemoState();
  if (!ready) return <div className="loading-panel">Loading your local results…</div>;
  if (error) return <div className="form-error" role="alert">{error}</div>;

  const totals = new Map<string, number>();
  for (const vote of state.votes) {
    totals.set(vote.nomineeId, (totals.get(vote.nomineeId) ?? 0) + 1);
  }
  const totalVotes = state.votes.length;

  return (
    <>
      <div className="result-summary">
        <span className="result-summary-mark">↗</span>
        <div><strong>{totalVotes}</strong><span>{totalVotes === 1 ? "demo vote" : "demo votes"} recorded in this browser</span></div>
        <span className="local-only-tag">LOCAL PREVIEW</span>
      </div>
      {categories.map((category) => {
        const nominees = [
          ...category.nominees,
          ...state.registeredNominees.filter((nominee) => nominee.categoryId === category.id),
        ];
        const ranked = nominees.sort(
          (left, right) => (totals.get(right.id) ?? 0) - (totals.get(left.id) ?? 0),
        );
        const categoryVoteCount = nominees.reduce(
          (total, nominee) => total + (totals.get(nominee.id) ?? 0),
          0,
        );
        return (
          <section className="results-category" key={category.id}>
            <div className="results-category-heading"><div><span className="eyebrow">CATEGORY</span><h2>{category.name}</h2></div><span>{nominees.length} nominees</span></div>
            {ranked.map((nominee, index) => {
              const count = totals.get(nominee.id) ?? 0;
              return (
                <div className="result-row" key={nominee.id}>
                  <span className={`result-rank ${index === 0 && count > 0 ? "result-rank-first" : ""}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="result-name">{nominee.name}</span>
                  <span className="result-meter"><i style={{ width: `${categoryVoteCount ? Math.round((count / categoryVoteCount) * 100) : 0}%` }} /></span>
                  <strong className="result-count">{count} {count === 1 ? "vote" : "votes"}</strong>
                </div>
              );
            })}
          </section>
        );
      })}
    </>
  );
}
