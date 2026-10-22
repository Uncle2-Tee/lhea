"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Star } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { CastVote } from "@/components/vote-actions";
import { PageHeading } from "@/components/ui";
import { useDemoState } from "@/components/demo-provider";
import type { AwardCategory } from "@/lib/election-data";
import { isRegisteredNominee } from "@/lib/demo-state";

export function CategoryNomineeList({ category }: { category: AwardCategory }) {
  const { state, ready } = useDemoState();
  const nominees = [
    ...category.nominees,
    ...state.registeredNominees.filter((nominee) => nominee.categoryId === category.id),
  ];

  return (
    <AppFrame>
      <Link href="/categories" className="back-link"><span aria-hidden="true">←</span> All categories</Link>
      <PageHeading
        eyebrow={`AWARD CATEGORY · ${nominees.length} NOMINEES`}
        title={category.name}
        description={category.description}
      />
      <div className="category-detail-banner">
        <span className="detail-banner-mark"><Star size={20} /></span>
        <div><strong>Choose the nominee you want to support.</strong><p>Voters can browse and cast a vote without creating an account.</p></div>
        <Link href="/payment" className="text-link">Get votes <span aria-hidden="true">→</span></Link>
      </div>
      {!ready ? <div className="loading-panel">Loading nominees…</div> : (
        <div className="nominee-list">
          {nominees.map((nominee, index) => (
            <article className="nominee-card" key={nominee.id}>
              <Link href={`/nominees/${nominee.id}`} className="nominee-portrait" style={{ backgroundColor: nominee.accent }} aria-label={`View ${nominee.name}'s profile`}>
                {isRegisteredNominee(nominee) ? <Image src={nominee.photoDataUrl} alt="" fill sizes="75px" unoptimized /> : <span>{nominee.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>}
                <small>{String(index + 1).padStart(2, "0")}</small>
              </Link>
              <div className="nominee-copy">
                <span className="nominee-category">{category.name}</span>
                <h2><Link href={`/nominees/${nominee.id}`}>{nominee.name}</Link></h2>
                <p>{nominee.detail}</p>
                <span className="sample-label"><Check size={12} />{isRegisteredNominee(nominee) ? "Registered nominee" : "Sample nominee"}</span>
              </div>
              <div className="nominee-vote"><CastVote category={category} nominee={nominee} /></div>
            </article>
          ))}
        </div>
      )}
    </AppFrame>
  );
}
