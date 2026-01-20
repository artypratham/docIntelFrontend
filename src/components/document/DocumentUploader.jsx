import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import Card from "../shared/Card.jsx";
import Button from "../shared/Button.jsx";

export default function DocumentUploader({ uploadedFile, isUploading, onUpload, onReset }) {
  function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a PDF file.");
      return;
    }

    onUpload(file);
  }

  return (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
          <Upload className="w-5 h-5 text-amber-800" />
        </div>
        <div>
          <h2 className="text-xl font-light tracking-tight text-slate-900">Upload Document</h2>
          <p className="text-sm text-slate-500 mt-1">PDF only • Fast extraction pipeline</p>
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
        disabled={isUploading}
      />

      <label
        htmlFor="file-upload"
        className={[
          "block cursor-pointer rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-6 py-10 text-center transition-all shadow-soft",
          uploadedFile ? "ring-1 ring-emerald-200" : "hover:ring-1 hover:ring-amber-200"
        ].join(" ")}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-slate-800 font-medium">Uploading & indexing…</p>
            <p className="text-slate-500 text-sm">Please wait</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="w-10 h-10 text-emerald-600" />
            <p className="text-slate-900 font-semibold">{uploadedFile.name}</p>
            <p className="text-slate-500 text-sm">Ready for extraction</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <FileText className="w-10 h-10 text-slate-400" />
            <p className="text-slate-900 font-medium">Click to upload a PDF</p>
            <p className="text-slate-500 text-sm">Tip: Use clean scans for best accuracy</p>
          </div>
        )}
      </label>

      {uploadedFile && (
        <div className="mt-6">
          <Button variant="subtle" className="w-full" onClick={onReset}>
            <Trash2 className="w-4 h-4" />
            Clear & Start Over
          </Button>
        </div>
      )}
    </Card>
  );
}
