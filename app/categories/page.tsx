import { Search } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { CategoryCards } from "@/components/category-cards";
import { PageHeading } from "@/components/ui";
import { categories } from "@/lib/election-data";

export default function CategoriesPage() {
  return (
    <AppFrame>
      <PageHeading
        eyebrow="THE 2026 SHORTLIST"
        title="Award categories"
        description="Every category is open to explore. Find the work that speaks to you."
      />
      <div className="category-toolbar">
        <div className="search-display"><Search size={16} /><span>Browse the awards shortlist</span></div>
        <span className="toolbar-count">{categories.length} categories</span>
      </div>
      <CategoryCards />
      <div className="info-banner"><span>i</span><p>Voters can browse nominees and cast votes without registering. Nominee registrations in this preview are stored only in this browser.</p></div>
    </AppFrame>
  );
}
