"use client";

import React, { useState, useMemo } from "react";
import { FaqItem, faqCategories } from "@/content/faq";

export interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFaqs = useMemo(() => {
    return items.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="w-full flex flex-col">
      {/* Search Input & Category Filter Pills */}
      <div className="mb-8 md:mb-10 flex flex-col gap-4">
        {/* Search Field */}
        <div className="relative max-w-xl">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <input
            id="faq-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. visa, malaria, currency, rafting)..."
            className="w-full min-h-[44px] px-4 py-2.5 rounded-control bg-white border border-sand text-ink placeholder:text-ink/50 text-sm sm:text-base font-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink min-h-[44px] px-2 text-sm font-heading"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div
          className="flex flex-wrap items-center gap-2 sm:gap-2.5"
          role="region"
          aria-label="Filter FAQ topics"
        >
          {faqCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={isSelected}
                className={`min-h-[44px] px-4 py-2 rounded-control font-heading text-sm transition-colors flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                  isSelected
                    ? "bg-forest text-bone font-medium shadow-none"
                    : "bg-white text-ink/80 hover:text-ink hover:bg-sand/40 border border-sand"
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Questions List */}
      {filteredFaqs.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-card border border-sand p-8">
          <p className="font-body text-ink/70 text-lg mb-4">
            No questions match your search or filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-control bg-forest text-bone text-sm font-heading font-medium hover:bg-forest/90 transition-colors"
          >
            Reset search and filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-white border border-sand rounded-[14px] overflow-hidden transition-colors hover:border-forest/40 open:border-forest/40"
            >
              <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none font-heading font-semibold text-base sm:text-lg text-ink hover:text-forest select-none min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest rounded-[14px]">
                <span className="pr-4">{faq.question}</span>
                <span
                  className="w-7 h-7 rounded-full bg-bone text-forest flex items-center justify-center shrink-0 text-sm font-bold transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                >
                  ↓
                </span>
              </summary>
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-sand/50">
                <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

