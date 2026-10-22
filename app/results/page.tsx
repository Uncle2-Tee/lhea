import { AppFrame } from "@/components/app-frame";
import { ResultsPanel } from "@/components/account-panels";
import { PageHeading } from "@/components/ui";

export default function ResultsPage() {
  return (
    <AppFrame>
      <PageHeading
        eyebrow="AWARD NIGHT"
        title="The results"
        description="A live tally of votes cast from this browser's preview ballot."
      />
      <div className="info-banner"><span>i</span><p>These are local preview totals only. They do not represent public voting or official award results.</p></div>
      <div className="results-list"><ResultsPanel /></div>
    </AppFrame>
  );
}
