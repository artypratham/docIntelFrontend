import { cn } from "../../utils/cn.js";

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all",
        className
      )}
      {...props}
    />
  );
}
