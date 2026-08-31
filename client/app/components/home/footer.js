export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-10 py-6 max-[600px]:flex-col max-[600px]:gap-3 max-[600px]:px-5">
        <span className="mono-meta text-ink-faint">flashloom © 2026</span>
        <div className="flex gap-5">
          {["privacy", "terms", "contact"].map((item) => (
            <span key={item} className="mono-meta text-ink-faint">
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
