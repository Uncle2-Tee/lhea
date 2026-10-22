import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Sparkles } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { PurchaseForm } from "@/components/purchase-form";
import { PageHeading } from "@/components/ui";

const assurances = [
  "No real payment is taken in this preview",
  "Demo voting codes are saved in your browser",
  "No voter account or sign-in is required",
];

export default function PaymentPage() {
  return (
    <AppFrame>
      <Link href="/dashboard" className="back-link"><ArrowLeft size={15} /> Back to overview</Link>
      <PageHeading
        eyebrow="VOTING CODES"
        title="Get votes in your hands."
        description="Choose a pack and try out the complete voting journey."
      />
      <div className="checkout-layout">
        <section className="checkout-main">
          <div className="checkout-card">
            <div className="checkout-card-heading">
              <span className="checkout-heading-icon"><Sparkles size={18} /></span>
              <div><h2>Build your vote pack</h2><p>Choose how many votes you want to try.</p></div>
            </div>
            <PurchaseForm />
          </div>
        </section>
        <aside className="checkout-aside">
          <div className="summary-card">
            <span className="eyebrow">YOUR CHECKOUT</span>
            <h2>Simple, clear, no surprises.</h2>
            <p>Paystack is the recommended provider for Ghanaian mobile money and card payments. It is not connected yet; this preview creates demo codes only.</p>
            <div className="assurance-list">
              {assurances.map((item) => <span key={item}><Check size={15} /> {item}</span>)}
            </div>
            <div className="summary-lock"><ShieldCheck size={17} /><span>Paystack setup required for real payments</span></div>
          </div>
          <div className="checkout-help">
            <strong>Just looking around?</strong>
            <p>Explore nominees without creating an account or buying a code.</p>
            <Link href="/categories">Browse categories <ArrowLeft size={13} className="rotate-180" /></Link>
          </div>
        </aside>
      </div>
    </AppFrame>
  );
}
