import { featureDescriptions } from "../../../utils/featureDescriptions";

export default function FeaturesGrid() {
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-3 max-[600px]:grid-cols-1">
      {featureDescriptions.map((feature, index) => (
        <div
          key={feature.title}
          className="border-l border-rule px-9 py-11 first:border-l-0 max-[600px]:border-l-0 max-[600px]:border-t max-[600px]:first:border-t-0"
        >
          <span className="mono-label">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.01em] text-ink">{feature.title}</h3>
          <p className="mt-2 text-pretty text-[14.5px] leading-[1.65] text-ink-muted">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
