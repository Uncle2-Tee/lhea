import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PurchaseSuccessPanel } from "@/components/purchase-form";

export default function PaymentSuccessPage() {
  return (
    <main className="success-page">
      <section className="payment-confirmation-card">
        <div className="confirmation-sparkle confirmation-sparkle-one">✦</div>
        <div className="confirmation-sparkle confirmation-sparkle-two">✧</div>
        <PurchaseSuccessPanel />
      </section>
      <Link className="success-back-link" href="/payment"><ArrowLeft size={14} /> Return to vote packs</Link>
      <p className="success-page-footnote">No real money has been charged. Preview codes are stored only in your browser.</p>
    </main>
  );
}
