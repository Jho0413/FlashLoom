import { cn } from "./cn";

export default function FlashcardGrid({ children, className }) {
  return (
    <div
      className={cn(
        "grid gap-3.5 [grid-template-columns:repeat(3,minmax(0,1fr))]",
        "max-[900px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[600px]:grid-cols-1",
        className
      )}
    >
      {children}
    </div>
  );
}
