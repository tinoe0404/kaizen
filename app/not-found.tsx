import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section className="bg-bone py-20 md:py-32 flex-1 flex items-center justify-center">
      <Container className="text-center flex flex-col items-center">
        <span className="font-heading font-semibold text-sm tracking-[0.18em] text-forest uppercase mb-3">
          404 ERROR
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
          We could not find that page.
        </h1>
        <p className="font-body text-ink/75 text-base sm:text-lg max-w-md mt-4 mb-8 leading-relaxed">
          The page you are looking for might have been moved, removed, or does not exist.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="solid">
            Back to home
          </Button>
          <Button href="/trip" variant="primary">
            Build your trip
          </Button>
        </div>
      </Container>
    </Section>
  );
}

