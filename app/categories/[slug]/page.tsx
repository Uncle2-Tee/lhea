import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryNomineeList } from "@/components/category-nominee-list";
import { categories } from "@/lib/election-data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.id }));
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="loading-panel">Loading category…</div>}>
      <CategoryDetail params={params} />
    </Suspense>
  );
}

async function CategoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((item) => item.id === slug);
  if (!category) notFound();

  return <CategoryNomineeList category={category} />;
}
