"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Star } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { CastVote } from "@/components/vote-actions";
import { PageHeading } from "@/components/ui";
import { useDemoState } from "@/components/demo-provider";
import { getNominee } from "@/lib/election-data";
import { isRegisteredNominee } from "@/lib/demo-state";

export function NomineeDetails({ id }: { id: string }) {
  const { state, ready } = useDemoState();
  if (!ready) return <div className="loading-panel">Loading nominee…</div>;

  const details = getNominee(id, state.registeredNominees);
  if (!details) {
    return (
      <AppFrame>
        <div className="empty-state">
          <h1>Nominee not found</h1>
          <p>This profile may not be registered in this browser preview.</p>
          <Link href="/categories" className="button button-primary">Browse categories</Link>
        </div>
      </AppFrame>
    );
  }

  const { category, nominee } = details;
  const registered = isRegisteredNominee(nominee);
  const initials = nominee.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return (
    <AppFrame>
      <Link href={`/categories/${category.id}`} className="back-link"><ArrowLeft size={15} /> {category.name}</Link>
      <PageHeading
        eyebrow="MEET THE NOMINEE"
        title={nominee.name}
        description={registered ? "Get to know this nominee and cast a vote without creating an account." : "Discover the shortlist and cast your support with a demo voting code."}
      />
      <section className="nominee-profile">
        <div className="nominee-profile-art" style={{ backgroundColor: nominee.accent }}>
          {registered ? <Image src={nominee.photoDataUrl} alt={`${nominee.name} profile`} fill sizes="(max-width: 900px) 100vw, 40vw" unoptimized /> : <span className="profile-initials">{initials}</span>}
          <span className="profile-art-orbit" />
          <span className="profile-sample-tag"><Check size={12} /> {registered ? "REGISTERED NOMINEE" : "SAMPLE NOMINEE"}</span>
          <span className="profile-art-category">{category.name}</span>
        </div>
        <div className="nominee-profile-content">
          <span className="eyebrow">{registered ? "NOMINEE PROFILE" : "SAMPLE PROFILE"}</span>
          <h2>{nominee.name}</h2>
          <p className="nominee-profile-detail">{nominee.detail}</p>
          <p className="nominee-profile-description">{registered ? nominee.bio : `${category.description} This sample profile is ready for official biography, approved photography, and verified nominee details when the awards data is available.`}</p>
          <div className="nominee-profile-facts">
            <div><span>Award category</span><strong>{category.name}</strong></div>
            <div><span>Nomination</span><strong>2026 awards</strong></div>
            <div><span>Ballot</span><strong>Open for voting</strong></div>
          </div>
          <div className="nominee-profile-vote">
            <div><Star size={17} /><span><strong>Support this nominee</strong><small>One vote will use one code credit.</small></span></div>
            <CastVote category={category} nominee={nominee} />
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
