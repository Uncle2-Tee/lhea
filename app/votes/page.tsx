import { AppFrame } from "@/components/app-frame";
import { MyVotesPanel } from "@/components/account-panels";
import { PageHeading } from "@/components/ui";

export default function VotesPage() {
  return (
    <AppFrame>
      <PageHeading
        eyebrow="YOUR BALLOT"
        title="My votes"
        description="A private record of the votes you have cast in this browser."
      />
      <section className="panel activity-panel"><MyVotesPanel /></section>
    </AppFrame>
  );
}
