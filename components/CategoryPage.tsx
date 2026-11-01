import React from "react";
import { Category } from "@/content/types";
import { getCategoryConfig } from "@/content/categories";
import { getAll } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/CategoryGrid";

export interface CategoryPageProps {
  category: Category;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const config = getCategoryConfig(category);
  const items = getAll(category);
  const destinations = getAll("destination");

  return (
    <div className="w-full flex flex-col">
      {/* Top Band (sand background, breadcrumb-free) */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            {config.title}
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[640px] leading-relaxed">
            {config.intro}
          </p>
        </Container>
      </Section>

      {/* Main Grid Section with Destination Filtering */}
      <Section className="bg-bone py-12 md:py-16">
        <Container>
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-body text-ink/70 text-lg">
                Nothing here yet. Check back soon.
              </p>
            </div>
          ) : (
            <CategoryGrid
              category={category}
              items={items}
              destinations={destinations}
            />
          )}
        </Container>
      </Section>

      {/* Bottom CTA Band */}
      <Section
        sand
        className="border-t border-forest/10 py-12 md:py-16 text-center"
      >
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-6">
            Ready to put it together?
          </h2>
          <Button href="/trip" variant="primary">
            Build your trip
          </Button>
        </Container>
      </Section>
    </div>
  );
}
