import { Suspense } from "react";
import { NomineeDetails as NomineeDetailsContent } from "@/components/nominee-details";
import { categories } from "@/lib/election-data";

export function generateStaticParams() {
  return categories.flatMap((category) => category.nominees.map((nominee) => ({ id: nominee.id })));
}

export default function NomineePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="loading-panel">Loading nominee…</div>}>
      <NomineePageContent params={params} />
    </Suspense>
  );
}

async function NomineePageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NomineeDetailsContent id={id} />;
}
