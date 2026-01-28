export default function PageShell({ children }) {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-amber-50/40" />
      <div className="fixed inset-0 -z-10 opacity-[0.35] bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-10">{children}</div>
    </div>
  );
}
