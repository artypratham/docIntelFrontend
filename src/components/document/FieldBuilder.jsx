import { useState } from "react";
import { Plus, Trash2, Sparkles, FileJson, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Card from "../shared/Card.jsx";
import Button from "../shared/Button.jsx";
import Input from "../shared/Input.jsx";
import Select from "../shared/Select.jsx";

export default function FieldBuilder({
  fields,
  setFields,
  batchExtraction,
  setBatchExtraction,
  canExtract,
  isExtracting,
  onExtract
}) {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [jsonSuccess, setJsonSuccess] = useState(null);

  function addField() {
    setFields([...fields, { name: "", description: "", type: "string" }]);
  }

  function removeField(idx) {
    setFields(fields.filter((_, i) => i !== idx));
  }

  function updateField(idx, key, value) {
    const copy = [...fields];
    copy[idx][key] = value;
    setFields(copy);
  }

  function parseJsonSchema() {
    setJsonError(null);
    setJsonSuccess(null);
    
    if (!jsonInput.trim()) {
      setJsonError("Please enter a JSON schema");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      
      // Support multiple wrappers:
      // - Swagger-style: { schema: {...}, batch_extraction: true/false }
      // - Older: { extraction_schema: {...} }
      // - Raw schema: { type: "object", properties: {...} }
      const schema = parsed.schema || parsed.extraction_schema || parsed;
      const importedBatch = parsed.batch_extraction === true;
      
      if (!schema.properties || typeof schema.properties !== "object") {
        setJsonError("Invalid schema: 'properties' object not found");
        return;
      }

      const newFields = Object.entries(schema.properties).map(([name, config]) => {
        // Handle format field - if format is "date", use "date" type
        let fieldType = config.type || "string";
        if (config.format === "date" && fieldType === "string") {
          fieldType = "date";
        }
        
        return {
          name: name,
          description: config.description || "",
          type: fieldType
        };
      });

      if (newFields.length === 0) {
        setJsonError("No fields found in the schema");
        return;
      }

      setFields(newFields);
      if (importedBatch) setBatchExtraction(true);
      setJsonInput("");
      setJsonError(null);
      setJsonSuccess(`Successfully imported ${newFields.length} field${newFields.length !== 1 ? 's' : ''}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setJsonSuccess(null), 3000);
    } catch (err) {
      setJsonError(`Invalid JSON: ${err.message}`);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-3 rounded-2xl bg-slate-900 flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-light tracking-tight text-slate-900">
            Define Extraction Fields
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provide name + description so the model extracts precisely.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white/70 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">Extraction Mode</p>
              <span
                className={[
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  batchExtraction
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-white text-slate-700"
                ].join(" ")}
              >
                {batchExtraction ? "Faster" : "Accurate"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Batch extraction is faster, single-field is usually more accurate.
            </p>
          </div>

          <label className="inline-flex items-center gap-3 select-none">
            <span className="text-xs font-medium text-slate-700">
              {batchExtraction ? "Faster" : "Accurate"}
            </span>
            <button
              type="button"
              onClick={() => setBatchExtraction((v) => !v)}
              className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-white",
                batchExtraction ? "bg-slate-900" : "bg-slate-200"
              ].join(" ")}
              role="switch"
              aria-checked={batchExtraction}
              aria-label={`Toggle extraction mode (currently ${batchExtraction ? "Faster" : "Accurate"})`}
            >
              <span
                className={[
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                  batchExtraction ? "translate-x-5" : "translate-x-1"
                ].join(" ")}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Manual Field Builder */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
              Manual Entry
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>

          <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[450px] overflow-y-auto pr-2 sm:pr-3 custom-scrollbar">
            {fields.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-8 text-center">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No fields defined yet</p>
                <p className="text-xs text-slate-400 mt-1">Add a field to get started</p>
              </div>
            ) : (
              fields.map((field, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Field Name
                        </label>
                        <Input
                          value={field.name}
                          placeholder="e.g., loan_amount"
                          onChange={(e) => updateField(idx, "name", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Description
                        </label>
                        <Input
                          value={field.description}
                          placeholder="e.g., Total sanctioned loan amount"
                          onChange={(e) => updateField(idx, "description", e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Data Type
                        </label>
                        <Select
                          value={field.type}
                          onChange={(e) => updateField(idx, "type", e.target.value)}
                          className="text-sm"
                        >
                          <option value="string">Text (string)</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="boolean">Boolean</option>
                        </Select>
                      </div>
                    </div>

                    {fields.length > 1 && (
                      <button
                        onClick={() => removeField(idx)}
                        className="rounded-2xl border border-transparent hover:border-rose-200 bg-white px-3 py-3 text-rose-600 hover:bg-rose-50 transition-all flex-shrink-0"
                        title="Remove field"
                        aria-label="Remove field"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <Button variant="subtle" onClick={addField} className="w-full">
            <Plus className="w-4 h-4" />
            <span>Add Field</span>
          </Button>
        </div>

        {/* JSON Schema Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
              JSON Import
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                  setJsonSuccess(null);
                }}
                placeholder='Paste your JSON schema here...\n\nExample format:\n{\n  "schema": {\n    "type": "object",\n    "properties": { ... }\n  }\n}'
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all font-mono resize-none leading-relaxed"
                rows={14}
              />
              {jsonInput && (
                <div className="absolute top-3 right-3">
                  <div className="px-2 py-1 rounded-lg bg-slate-100 text-xs text-slate-500 font-mono">
                    {jsonInput.split('\n').length} lines
                  </div>
                </div>
              )}
            </div>

            {jsonError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 flex-1">{jsonError}</p>
              </div>
            )}

            {jsonSuccess && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 flex-1">{jsonSuccess}</p>
              </div>
            )}

            <Button
              variant="subtle"
              onClick={parseJsonSchema}
              disabled={!jsonInput.trim()}
              className="w-full"
            >
              <FileJson className="w-4 h-4" />
              <span>Import from JSON</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4 sm:pt-6 border-t border-slate-200">
        <div className="grid gap-3">
          <Button
            onClick={onExtract}
            disabled={!canExtract || isExtracting}
            className="w-full"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting…</span>
              </>
            ) : (
              <span>Start Extraction</span>
            )}
          </Button>

          {!canExtract && (
            <p className="text-xs text-slate-500 text-center py-1">
              Upload a document first to enable extraction.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
