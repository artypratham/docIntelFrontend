import { cn } from "../../utils/cn.js";

export default function Card({ className, children }) {
  return (
    <div
      className={cn(
        "bg-white/90 backdrop-blur rounded-3xl border border-slate-200 shadow-luxe",
        className
      )}
    >
      {children}
    </div>
  );
}
