const SHARED =
  "w-full rounded-md border border-hairline bg-surface-sunken p-4 text-[14.5px] leading-[1.7] text-ink placeholder:text-ink-faint focus-visible:border-accent";

export default function InputField({
  name,
  label,
  value,
  setValue,
  type = "textarea",
  rows = 4,
  minHeight,
  maxLength,
  placeholder,
  required = false,
}) {
  const onChange = (event) =>
    setValue((prev) => ({ ...prev, [name]: event.target.value }));

  return (
    <label className="block">
      <span className="mono-label">{label}</span>
      <div className="mt-2">
        {type === "input" ? (
          <input
            type="text"
            name={name}
            value={value[name] || ""}
            onChange={onChange}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            className={SHARED}
          />
        ) : (
          <textarea
            name={name}
            value={value[name] || ""}
            onChange={onChange}
            rows={rows}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            style={minHeight ? { minHeight } : undefined}
            className={`${SHARED} resize-y`}
          />
        )}
      </div>
    </label>
  );
}
