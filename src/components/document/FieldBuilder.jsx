import { Plus, Trash2, Sparkles } from "lucide-react";
import Card from "../shared/Card.jsx";
import Button from "../shared/Button.jsx";
import Input from "../shared/Input.jsx";
import Select from "../shared/Select.jsx";

export default function FieldBuilder({ fields, setFields, canExtract, isExtracting, onExtract }) {
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

  return (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-slate-900">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-light tracking-tight text-slate-900">
            Define Extraction Fields
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Provide name + description so the model extracts precisely.
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  value={field.name}
                  placeholder="Field name (e.g., loan_amount)"
                  onChange={(e) => updateField(idx, "name", e.target.value)}
                />
                <Input
                  value={field.description}
                  placeholder="Description (e.g., Total sanctioned loan amount)"
                  onChange={(e) => updateField(idx, "description", e.target.value)}
                />
                <Select
                  value={field.type}
                  onChange={(e) => updateField(idx, "type", e.target.value)}
                >
                  <option value="string">Text (string)</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="boolean">Boolean</option>
                </Select>
              </div>

              {fields.length > 1 && (
                <button
                  onClick={() => removeField(idx)}
                  className="rounded-2xl border border-transparent hover:border-rose-200 bg-white px-3 py-3 text-rose-600 hover:bg-rose-50 transition-all"
                  title="Remove field"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        <Button variant="subtle" onClick={addField}>
          <Plus className="w-4 h-4" />
          Add Field
        </Button>

        <Button
          onClick={onExtract}
          disabled={!canExtract || isExtracting}
          className="w-full"
        >
          {isExtracting ? "Extracting…" : "Start Extraction"}
        </Button>

        {!canExtract && (
          <p className="text-xs text-slate-500 text-center">
            Upload a document first to enable extraction.
          </p>
        )}
      </div>
    </Card>
  );
}
