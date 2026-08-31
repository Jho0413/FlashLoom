"use client";

import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import PageShell from "../components/common/pageShell";
import LoadingPage from "../components/common/loadingPage";
import SessionModal from "../components/common/sessionModal";
import Button from "../components/ui/Button";
import Shimmer from "../components/ui/Shimmer";
import formatUnixToDate from "@/utils/convertUNIXToDate";

const BILLING_PORTAL = "https://billing.stripe.com/p/login/test_cN27uT8mX5LmdJC144";

function Row({ label, children }) {
  return (
    <div className="flex gap-6 border-t border-rule py-5 max-[600px]:flex-col max-[600px]:gap-1">
      <span className="mono-label w-[200px] shrink-0 pt-[2px] max-[600px]:w-auto">{label}</span>
      <div className="flex-1 text-[14.5px] text-ink">{children}</div>
    </div>
  );
}

export default function SubscriptionPage() {
  const { isLoaded, session } = useSession();

  const { isPending, isError, data, refetch } = useQuery({
    queryKey: [session?.user?.id, "subscriptionData"],
    queryFn: async () => {
      const token = await session.getToken();
      const response = await fetch("/api/stripe-subscription/subscription", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to find subscription information");
      return response.json();
    },
    enabled: !!session,
    staleTime: 1000 * 60 * 60,
  });

  if (!isLoaded) return <LoadingPage />;
  if (!session) return <SessionModal sessionExpired />;

  const loading = isPending;
  const email = session.user?.primaryEmailAddress?.emailAddress;
  const billingUrl = email ? `${BILLING_PORTAL}?prefilled_email=${encodeURIComponent(email)}` : BILLING_PORTAL;

  return (
    <PageShell width="subscription">
      <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-ink">Subscription</h1>

      {isError ? (
        <div className="mt-6 flex items-center gap-3 rounded border border-danger-border bg-danger-bg px-[13px] py-[10px] text-[13px] text-danger">
          <span>Couldn&rsquo;t load your subscription.</span>
          <button type="button" onClick={() => refetch()} className="font-mono underline">
            retry
          </button>
        </div>
      ) : null}

      <div className="mt-6">
        <Row label="Subscription Plan">
          {loading ? (
            <Shimmer />
          ) : (
            <span>
              {data.plan}
              {data.plan === "Free" ? (
                <span className="text-ink-muted">
                  {" "}
                  · {Math.max(0, 3 - data.generations)} generations left
                </span>
              ) : null}
            </span>
          )}
        </Row>

        <Row label={data?.cancelled ? "Subscription End Date" : "Next Payment Date"}>
          {loading ? (
            <Shimmer />
          ) : (
            <span>{data.subscriptionEndTime ? formatUnixToDate(data.subscriptionEndTime) : "Not set"}</span>
          )}
        </Row>

        <Row label="Manage Subscription">
          <Button href={billingUrl} variant="secondary" target="_blank" rel="noreferrer">
            Open billing portal ↗
          </Button>
        </Row>
      </div>
    </PageShell>
  );
}
