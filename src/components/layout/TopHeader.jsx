import { Database } from "lucide-react";

export default function TopHeader({ healthStatus }) {
  const isHealthy = healthStatus?.status === "healthy";
  const isError = healthStatus?.status === "error";

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-3xl bg-slate-900 shadow-luxe">
          <Database className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900">
            Document Intelligence
          </h1>
          <p className="text-slate-600 mt-2">
            RAG + LLM Inference for Legal Information Extraction
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-soft">
          <span
            className={[
              "w-2.5 h-2.5 rounded-full",
              isHealthy ? "bg-emerald-500" : isError ? "bg-rose-500" : "bg-amber-400"
            ].join(" ")}
          />
          <span className="text-sm text-slate-700">
            {isHealthy ? "Backend Online" : isError ? "Backend Offline" : "Connecting"}
          </span>
        </div>
      </div>
    </div>
  );
}
