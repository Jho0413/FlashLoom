import { cn } from "../ui/cn";

const WIDTHS = {
  generate: "max-w-generate",
  library: "max-w-library",
  prose: "max-w-prose",
  subscription: "max-w-subscription",
};

export default function PageShell({ width = "generate", pt = "pt-12", className, children }) {
  return (
    <main className={cn("mx-auto px-10 pb-23 max-[600px]:px-5", pt, WIDTHS[width], className)}>
      {children}
    </main>
  );
}
