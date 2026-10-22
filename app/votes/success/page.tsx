import Link from "next/link";
import { ArrowRight, ClipboardList, Star } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { VoteConfirmationPanel } from "@/components/account-panels";

export default function VoteSuccessPage() {
  return (
    <AppFrame>
      <div className="vote-success-header"><span className="eyebrow">BALLOT CONFIRMATION</span></div>
      <VoteConfirmationPanel />
      <div className="vote-success-links">
        <Link href="/votes"><ClipboardList size={16} /> My votes</Link>
        <Link href="/categories"><Star size={16} /> More categories</Link>
        <Link href="/results">Local results <ArrowRight size={15} /></Link>
      </div>
    </AppFrame>
  );
}
