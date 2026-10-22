"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useDemoState } from "@/components/demo-provider";
import { categories } from "@/lib/election-data";

export function CategoryCards() {
  const { state } = useDemoState();

  return (
    <div className="category-page-grid">
      {categories.map((category, index) => {
        const nomineeCount = category.nominees.length +
          state.registeredNominees.filter((nominee) => nominee.categoryId === category.id).length;
        return (
          <Link key={category.id} href={`/categories/${category.id}`} className="category-page-card">
            <div className="category-page-top">
              <span className={`category-number category-number-${index % 3 + 1}`}>0{index + 1}</span>
              <span className="category-page-icon"><Star size={19} /></span>
              <ArrowRight size={17} className="category-arrow" />
            </div>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <div className="category-page-footer"><span>{nomineeCount} nominees</span><span className="category-status"><i /> Voting open</span></div>
          </Link>
        );
      })}
    </div>
  );
}
