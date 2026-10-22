import { Ticket } from "lucide-react";
import Link from "next/link";
import { AppFrame } from "@/components/app-frame";
import { VotingCodesPanel } from "@/components/account-panels";
import { ButtonLink, PageHeading } from "@/components/ui";

export default function CodesPage() {
  return (
    <AppFrame>
      <PageHeading
        eyebrow="YOUR VOTING WALLET"
        title="Voting codes"
        description="Keep your vote packs together and see what is still available."
        action={<ButtonLink href="/payment" icon={Ticket}>Get codes</ButtonLink>}
      />
      <div className="info-banner"><span>i</span><p>These codes work only in this browser preview. They are not real paid voting codes.</p></div>
      <section className="code-page-panel"><div className="panel-heading"><div><p className="eyebrow">MY CODES</p><h2>Your vote packs</h2></div></div><VotingCodesPanel /></section>
      <div className="understated-link"><Link href="/categories">Ready to vote? Browse the categories <span>→</span></Link></div>
    </AppFrame>
  );
}
