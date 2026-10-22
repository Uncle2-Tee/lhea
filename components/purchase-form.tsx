"use client";

import Link from "next/link";
import { ArrowRight, Check, Copy, CreditCard, Smartphone, Ticket, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useDemoState } from "@/components/demo-provider";
import { votePackages } from "@/lib/election-data";

function createCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const part = Array.from(bytes, (byte) => letters[byte % letters.length]).join("");
  return `LHEA-${part.slice(0, 4)}-${part.slice(4, 8)}-${part.slice(8)}`;
}

export function PurchaseForm() {
  const router = useRouter();
  const { state, ready, commit, error } = useDemoState();
  const [packageIndex, setPackageIndex] = useState(1);
  const [method, setMethod] = useState<"mobile" | "card">("mobile");
  const [network, setNetwork] = useState("MTN MoMo");
  const [formError, setFormError] = useState("");

  const selectedPackage = votePackages[packageIndex];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!ready) {
      setFormError("Voting data is still loading. Please try again.");
      return;
    }

    const code = createCode();
    const saved = commit({
      ...state,
      codes: [
        {
          id: crypto.randomUUID(),
          value: code,
          total: selectedPackage.votes,
          remaining: selectedPackage.votes,
          createdAt: new Date().toISOString(),
        },
        ...state.codes,
      ],
    });
    if (saved) router.push("/payment/success");
  }

  return (
    <form className="purchase-form" onSubmit={handleSubmit}>
      <section className="form-section">
        <div className="section-topline"><span>01</span><h2>Choose your voting pack</h2></div>
        <div className="package-grid">
          {votePackages.map((pack, index) => (
            <button
              type="button"
              key={pack.votes}
              onClick={() => setPackageIndex(index)}
              className={`package-card ${packageIndex === index ? "package-card-selected" : ""}`}
              aria-pressed={packageIndex === index}
            >
              <span className="package-radio">{packageIndex === index ? <Check size={13} /> : null}</span>
              <strong>{pack.votes} {pack.votes === 1 ? "vote" : "votes"}</strong>
              <span>GHS {pack.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="form-section">
        <div className="section-topline"><span>02</span><h2>Choose a payment method</h2></div>
        <div className="method-tabs">
          <button type="button" className={method === "mobile" ? "method-tab method-tab-active" : "method-tab"} onClick={() => setMethod("mobile")} aria-pressed={method === "mobile"}>
            <Smartphone size={17} /> Mobile money
          </button>
          <button type="button" className={method === "card" ? "method-tab method-tab-active" : "method-tab"} onClick={() => setMethod("card")} aria-pressed={method === "card"}>
            <CreditCard size={17} /> Bank card
          </button>
        </div>
        {method === "mobile" ? (
          <label className="field">
            <span>Mobile money network</span>
            <select value={network} onChange={(event) => setNetwork(event.target.value)}>
              <option>MTN MoMo</option>
              <option>Telecel Cash</option>
              <option>AirtelTigo Money</option>
            </select>
          </label>
        ) : (
          <div className="payment-placeholder"><Wallet size={18} /><span>Card collection is disabled in preview. No card details are requested.</span></div>
        )}
      </section>

      <div className="checkout-total">
        <span>{selectedPackage.votes} {selectedPackage.votes === 1 ? "vote" : "votes"} <small>· {method === "mobile" ? network : "Bank card"}</small></span>
        <strong>GHS {selectedPackage.price.toFixed(2)}</strong>
      </div>
      <div className="preview-warning">
        <strong>Preview checkout only.</strong> This will not charge you. Paystack is the recommended Ghana payment provider, but it is not connected; the button below creates a clearly labelled demo code.
      </div>
      {formError || error ? <p className="form-error" role="alert">{formError || error}</p> : null}
      <button className="button button-primary button-full" type="submit" disabled={!ready || (method === "card")}>
        {method === "card" ? "Card payments unavailable in preview" : "Create demo voting code"}
        {method !== "card" ? <Check size={16} /> : null}
      </button>
    </form>
  );
}

export function PurchaseSuccessPanel() {
  const { state, ready, error } = useDemoState();
  const [copyError, setCopyError] = useState("");
  const code = state.codes[0];

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.value);
      setCopyError("");
    } catch {
      setCopyError("Copy was blocked by your browser. Select the code and copy it manually.");
    }
  }

  if (!ready) return <div className="loading-panel">Loading your demo voting code…</div>;
  if (error) return <p className="form-error" role="alert">{error}</p>;
  if (!code) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><Ticket size={22} /></span>
        <h2>No new code to show.</h2>
        <p>Create a demo voting code first. This preview never takes payment.</p>
        <Link href="/payment" className="button button-primary">Return to vote packs</Link>
      </div>
    );
  }

  return (
    <div className="purchase-success">
      <span className="success-icon"><Check size={22} /></span>
      <span className="eyebrow">DEMO TRANSACTION · NO PAYMENT TAKEN</span>
      <h2>Your voting code is ready.</h2>
      <p>Save this code. It is stored in this browser and can be used to cast demo votes.</p>
      <div className="generated-code">
        <code>{code.value}</code>
        <button className="icon-button" type="button" onClick={copyCode} aria-label="Copy voting code"><Copy size={16} /></button>
      </div>
      <div className="success-details">
        <span>Vote pack <strong>{code.total} {code.total === 1 ? "vote" : "votes"}</strong></span>
        <span>Status <strong className="success-status">Ready to use</strong></span>
        <span>Payment <strong>Not connected</strong></span>
      </div>
      {copyError ? <p className="form-error" role="alert">{copyError}</p> : null}
      <Link className="button button-primary button-full" href="/codes">View my voting codes <Check size={16} /></Link>
      <Link className="subtle-action" href="/categories">Browse categories <ArrowRight size={14} /></Link>
    </div>
  );
}
