import React, { useMemo, useState } from "react";
import { Database, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import Card from "../shared/Card.jsx";
import Badge from "../shared/Badge.jsx";

function normalizeValue(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";

  // If backend returns object/array, show formatted JSON
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function isLongValue(str, threshold = 140) {
  if (!str) return false;
  return str.length >= threshold || str.includes("\n");
}

export default function ExtractionResults({ isExtracting, extractionResult }) {
  const [expandedRows, setExpandedRows] = useState({});

  const rows = useMemo(() => {
    const extraction = extractionResult?.extraction || {};
    return Object.entries(extraction);
  }, [extractionResult]);

  function toggleRow(key) {
    setExpandedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <Card className="p-8 lg:sticky lg:top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <Database className="w-5 h-5 text-slate-800" />
        </div>
        <div>
          <h2 className="text-xl font-light tracking-tight text-slate-900">
            Extraction Results
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Clean, review-friendly structured output
          </p>
        </div>
      </div>

      {isExtracting && (
        <div className="py-16 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="text-slate-900 font-medium">Analyzing document…</p>
          <p className="text-slate-500 text-sm">Hold on — precision takes a moment.</p>
        </div>
      )}

      {!isExtracting && !extractionResult && (
        <div className="py-16 flex flex-col items-center gap-4 text-slate-500">
          <Database className="w-16 h-16 opacity-30" />
          <p className="text-center text-sm">
            Upload a document and define fields to begin extraction.
          </p>
        </div>
      )}

      {!isExtracting && extractionResult && (
        <div className="space-y-6">
          {/* Metadata */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-amber-50/40 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Metadata</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Confidence</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {((extractionResult.metadata?.confidence ?? 0) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Fields Found</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {extractionResult.metadata?.fields_found ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Time</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {(extractionResult.metadata?.processing_time ?? 0).toFixed(1)}s
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Review Required</p>
                <div className="mt-2">
                  {extractionResult.metadata?.requires_review ? (
                    <Badge tone="warning">Yes</Badge>
                  ) : (
                    <Badge tone="success">No</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white">
            <div className="overflow-x-auto luxe-scroll">
              {/* table-fixed gives control over widths */}
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-4 font-semibold text-slate-700 w-[22%]">
                      Field
                    </th>

                    {/* Value: large chunk of width */}
                    <th className="text-left px-4 py-4 font-semibold text-slate-700 w-[20%]">
                      Value
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-slate-700 w-[15%]">
                      Confidence
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-slate-700 w-[15%]">
                      Source
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map(([key, rawValue], idx) => {
                    const prov = extractionResult.provenance?.[key];
                    const conf = prov?.confidence ?? null;
                    const page = prov?.source?.page_number ?? null;

                    const valueStr = normalizeValue(rawValue);
                    const long = isLongValue(valueStr);
                    const expanded = Boolean(expandedRows[key]);

                    return (
                      <tr
                        key={key}
                        className={[
                          "border-b border-slate-100 align-top",
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                        ].join(" ")}
                      >
                        {/* Field */}
                        <td className="px-5 py-4 font-medium text-slate-800 break-words">
                          {key}
                        </td>

                        {/* Value with collapse */}
                        <td className="px-5 py-4 text-slate-900">
                          {valueStr === null ? (
                            <span className="text-slate-400 italic">Not found</span>
                          ) : (
                            <div className="flex items-start gap-2">
                              {/* Content box */}
                              <div className="flex-1 min-w-0">
                                {/* When NOT expanded: 2 lines clamp */}
                                {!expanded && long ? (
                                  <p className="text-slate-900 break-words overflow-hidden text-ellipsis line-clamp-2">
                                    {valueStr}
                                  </p>
                                ) : (
                                  <pre
                                    className={[
                                      "whitespace-pre-wrap break-words text-slate-900 font-sans",
                                      long ? "leading-6" : ""
                                    ].join(" ")}
                                  >
                                    {valueStr}
                                  </pre>
                                )}
                              </div>

                              {/* Toggle button only for long values */}
                              {long && (
                                <button
                                  onClick={() => toggleRow(key)}
                                  className="shrink-0 mt-0.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2 py-2 transition-all"
                                  title={expanded ? "Collapse" : "Expand"}
                                >
                                  {expanded ? (
                                    <ChevronUp className="w-4 h-4 text-slate-700" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-slate-700" />
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Confidence */}
                        <td className="px-5 py-4">
                          {conf === null ? (
                            <span className="text-slate-400">—</span>
                          ) : conf >= 0.9 ? (
                            <Badge tone="success">{(conf * 100).toFixed(0)}%</Badge>
                          ) : conf >= 0.7 ? (
                            <Badge tone="warning">{(conf * 100).toFixed(0)}%</Badge>
                          ) : (
                            <Badge tone="danger">{(conf * 100).toFixed(0)}%</Badge>
                          )}
                        </td>

                        {/* Source */}
                        <td className="px-5 py-4">
                          {page ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                              <FileText className="w-3 h-3" />
                              Page {page}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
