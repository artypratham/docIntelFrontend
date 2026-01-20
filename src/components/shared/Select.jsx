import { cn } from "../../utils/cn.js";

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
