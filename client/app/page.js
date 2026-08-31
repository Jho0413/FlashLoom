"use client";

import { useAuth } from "@clerk/nextjs";
import Button from "./components/ui/Button";
import FeaturesGrid from "./components/home/featuresGrid";
import PricingGrid from "./components/home/pricingGrid";
import FaqSection from "./components/home/faqSection";
import Footer from "./components/home/footer";

const SAMPLE_TEXT =
  "The mitochondrion is the site of aerobic respiration in eukaryotic cells. Its inner membrane folds into cristae, increasing the surface area available for the electron transport chain. ATP synthase then uses the proton gradient across that membrane to phosphorylate ADP into ATP.";

function HeroPreview() {
  return (
    <div
      id="preview"
      className="mx-auto mt-16 w-full max-w-[900px] scroll-mt-20 overflow-hidden rounded-xl border border-hairline bg-surface text-left"
    >
      <div className="flex border-b border-rule">
        {["Paste text", "YouTube link", "Upload PDF"].map((label, index) => (
          <span
            key={label}
            className={
              index === 0
                ? "border-b-2 border-accent px-5 py-3 text-[13px] font-medium text-ink"
                : "px-5 py-3 text-[13px] font-medium text-ink-muted"
            }
          >
            {label}
          </span>
        ))}
      </div>
      <div className="p-5.5">
        <span className="mono-label">Your material</span>
        <div className="mt-2 rounded-md border border-hairline bg-surface-sunken p-4 text-[14.5px] leading-[1.7] text-ink-secondary">
          {SAMPLE_TEXT}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-rule px-5.5 py-4 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3">
        <span className="mono-meta text-ink-faint">302 / 8,000 chars · est. 6 cards</span>
        <span className="rounded bg-accent px-[22px] py-3 text-[14px] font-semibold text-accent-ink opacity-90">
          Generate flashcards
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const { isSignedIn } = useAuth();
  const startHref = isSignedIn ? "/generate" : "/sign-up";

  return (
    <div>
      <section className="grid-surface">
        <div className="mx-auto max-w-hero px-10 py-23 text-center max-[600px]:px-5 max-[600px]:py-16">
          <span className="mono-eyebrow text-accent">text · pdf · youtube &rarr; flashcards</span>
          <h1 className="mx-auto mt-5 max-w-[720px] text-balance text-[66px] font-semibold leading-[1.04] tracking-[-0.035em] text-ink max-[900px]:text-[44px] max-[600px]:text-[34px]">
            Study material in.
            <br />
            Flashcards out.
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-pretty text-[17.5px] leading-[1.65] text-ink-muted">
            Paste your notes, drop a PDF, or link a lecture. FlashLoom turns it into a clean set of
            question-and-answer cards you can study in minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 max-[600px]:flex-col">
            <Button href={startHref}>Get started</Button>
            <Button href="#preview" variant="secondary">
              View a sample deck
            </Button>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="border-t border-rule">
        <FeaturesGrid />
      </section>
      <section id="pricing" className="scroll-mt-16 border-t border-rule">
        <PricingGrid isSignedIn={isSignedIn} />
      </section>
      <section className="border-t border-rule">
        <FaqSection />
      </section>
      <Footer />
    </div>
  );
}
