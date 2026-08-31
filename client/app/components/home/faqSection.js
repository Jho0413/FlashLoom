import { FAQs } from "../../../utils/faqs";

export default function FaqSection() {
  return (
    <div className="mx-auto max-w-prose px-10 py-20 max-[600px]:px-5">
      <h2 className="text-[30px] font-semibold tracking-[-0.025em] text-ink">FAQ</h2>
      <div className="mt-6">
        {FAQs.map((faq) => (
          <details key={faq.question} className="group border-t border-hairline py-5 last:border-b">
            <summary className="flex cursor-pointer list-none items-start gap-3 text-[16px] font-medium leading-[1.5] text-ink [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className="mt-[2px] font-mono text-[13px] text-ink-faint group-open:text-accent"
              >
                <span className="group-open:hidden">[+]</span>
                <span className="hidden group-open:inline">[-]</span>
              </span>
              <span>{faq.question}</span>
            </summary>
            <p className="mt-3 pl-[34px] text-pretty text-[14.5px] leading-[1.65] text-ink-muted">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
