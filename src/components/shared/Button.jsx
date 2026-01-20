import { cn } from "../../utils/cn.js";

export default function Button({
  className,
  variant = "primary",
  disabled,
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-all active:scale-[0.99]";

  const variants = {
    primary:
      "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-luxe hover:opacity-[0.96]",
    subtle:
      "bg-slate-200 hover:bg-slate-200 text-slate-800 border border-slate-200",
    danger:
      "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
