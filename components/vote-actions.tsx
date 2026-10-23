"use client";

import Link from "next/link";
import { ArrowRight, Check, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemoState } from "@/components/demo-provider";
import type { AwardCategory, Nominee } from "@/lib/election-data";

export function CastVote({ category, nominee }: { category: AwardCategory; nominee: Nominee }) {
  const router = useRouter();
  const { state, ready, castVote, error } = useDemoState();
  const [selectedCode, setSelectedCode] = useState("");
  const [message, setMessage] = useState("");
  const availableCodes = state.codes.filter((code) => code.remaining > 0);

  async function cast() {
    setMessage("");
    if (!ready) {
      setMessage("Your voting codes are still loading. Please try again.");
      return;
    }
    const code = availableCodes.find((item) => item.id === selectedCode) ?? availableCodes[0];
    if (!code) {
      setMessage("You need an available voting code before casting a vote.");
      return;
    }

    const saved = await castVote(code.id, nominee.id, category.id);
    if (saved) router.push("/votes/success");
  }

  if (availableCodes.length === 0) {
    return (
      <div className="vote-unavailable">
        <span className="vote-unavailable-icon"><Ticket size={19} /></span>
        <div>
          <strong>Get a voting code to cast your vote</strong>
          <p>Codes created in preview mode are free and do not charge you.</p>
        </div>
        <Link href="/payment" className="button button-primary button-compact">Get a code <ArrowRight size={15} /></Link>
      </div>
    );
  }

  return (
    <div className="cast-vote">
      <label className="field">
        <span>Use voting code</span>
        <select value={selectedCode || availableCodes[0]?.id} onChange={(event) => setSelectedCode(event.target.value)}>
          {availableCodes.map((code) => (
            <option key={code.id} value={code.id}>{code.value} · {code.remaining} left</option>
          ))}
        </select>
      </label>
      <button className="button button-primary button-full" type="button" onClick={cast} disabled={!ready}>
        Cast vote for {nominee.name} <Check size={16} />
      </button>
      {message || error ? <p className="form-error" role="alert">{message || error}</p> : null}
      <p className="form-note">One vote will be deducted from the selected demo code.</p>
    </div>
  );
}
