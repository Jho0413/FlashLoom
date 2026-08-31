"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { pricingDescriptions } from "../../../utils/pricingDescriptions";
import getStripe from "@/utils/get-stripe";
import { cn } from "../ui/cn";

const CHIPS = { Basic: "popular", Pro: "soon" };

function TierCard({ tier, isSignedIn }) {
  const { session } = useSession();
  const router = useRouter();
  const [amount, cadence] = tier.price.split(" / ");
  const chip = CHIPS[tier.title];
  const featured = tier.title === "Basic";

  const selectPlan = async () => {
    if (tier.disabled) return;
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }
    if (tier.title === "Free Trial") {
      router.push("/generate");
      return;
    }
    const token = await session.getToken();
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan: tier.title }),
    });
    const { id } = await checkoutSession.json();
    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6.5",
        featured ? "bg-surface-accent shadow-[inset_0_2px_0_var(--accent)]" : "bg-surface"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="mono-label">{tier.title}</span>
        {chip ? (
          <span className="rounded-[999px] border border-hairline px-2 py-[3px] font-mono text-[10.5px] lowercase text-ink-muted">
            {chip}
          </span>
        ) : null}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[34px] font-semibold tracking-[-0.03em] text-ink">{amount}</span>
        <span className="text-[14px] text-ink-muted">/ {cadence}</span>
      </div>
      <p className="flex-1 text-pretty text-[14px] leading-[1.6] text-ink-muted">{tier.description}</p>
      <button
        type="button"
        onClick={selectPlan}
        disabled={tier.disabled}
        className={cn(
          "min-h-[44px] rounded px-4 text-[13.5px] font-semibold transition-[background-color,filter] duration-150",
          tier.disabled && "cursor-not-allowed border border-hairline bg-surface text-ink-faint",
          !tier.disabled && featured && "bg-accent text-accent-ink hover:brightness-[1.08]",
          !tier.disabled && !featured && "border border-hairline-strong text-ink hover:bg-surface"
        )}
      >
        {tier.disabled ? "Coming soon" : `Choose ${tier.title}`}
      </button>
    </div>
  );
}

export default function PricingGrid({ isSignedIn }) {
  return (
    <div className="mx-auto max-w-[1060px] px-10 py-20 max-[600px]:px-5">
      <h2 className="text-[30px] font-semibold tracking-[-0.025em] text-ink">Pricing</h2>
      <div className="mt-8 overflow-hidden rounded-xl border border-hairline bg-hairline">
        <div className="grid grid-cols-3 gap-px max-[600px]:grid-cols-1">
          {pricingDescriptions.map((tier) => (
            <TierCard key={tier.title} tier={tier} isSignedIn={isSignedIn} />
          ))}
        </div>
      </div>
    </div>
  );
}
