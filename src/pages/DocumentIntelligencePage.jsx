import React, { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import TopHeader from "../components/layout/TopHeader.jsx";

import DocumentUploader from "../components/document/DocumentUploader.jsx";
import FieldBuilder from "../components/document/FieldBuilder.jsx";
import ExtractionResults from "../components/document/ExtractionResults.jsx";

import { documentApi } from "../services/documentApi.js";
import { buildJsonSchema } from "../utils/schema.js";

export default function DocumentIntelligencePage() {
  const [healthStatus, setHealthStatus] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [docId, setDocId] = useState(null);

  const [fields, setFields] = useState([{ name: "", description: "", type: "string" }]);
  const [batchExtraction, setBatchExtraction] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const [extractionResult, setExtractionResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await documentApi.health();
        setHealthStatus(data);
      } catch (err) {
        setHealthStatus({ status: "error", message: err.message });
      }
    })();
  }, []);

  function hasAnyExtractedValue(extraction) {
    if (!extraction || typeof extraction !== "object") return false;

    return Object.values(extraction).some((v) => {
      if (v === null || v === undefined) return false;
      if (typeof v === "string") return v.trim().length > 0;
      // numbers/booleans/objects count as present
      return true;
    });
  }

  async function onUpload(file) {
    setUploadedFile(file);
    setIsUploading(true);
    setError(null);
    setExtractionResult(null);

    try {
      const data = await documentApi.uploadDocument(file);
      setDocId(data.doc_id);
    } catch (err) {
      setError({ message: err.message });
      setUploadedFile(null);
      setDocId(null);
    } finally {
      setIsUploading(false);
    }
  }

  async function onExtract() {
    if (!docId) {
      setError({ message: "Please upload a document first." });
      return;
    }

    const { extraction_schema, validFields } = buildJsonSchema(fields);

    if (validFields.length === 0) {
      setError({ message: "Add at least one field with name + description." });
      return;
    }

    setIsExtracting(true);
    setError(null);
    setExtractionResult(null);

    try {
      const data = await documentApi.extract(docId, extraction_schema, batchExtraction);
      const extraction = data?.extraction;

      // Backend can return partial results (some fields null/not_found) with HTTP 200 — that's OK.
      // Only show an error popup if the FINAL 200 response contains no extracted values at all.
      if (!hasAnyExtractedValue(extraction)) {
        setError({
          message:
            "Extraction finished, but no fields could be extracted from this document. Try refining field descriptions or uploading a clearer PDF."
        });
        setExtractionResult(null);
        return;
      }

      setExtractionResult(data);
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setIsExtracting(false);
    }
  }

  function resetAll() {
    setUploadedFile(null);
    setDocId(null);
    setFields([{ name: "", description: "", type: "string" }]);
    setBatchExtraction(false);
    setExtractionResult(null);
    setError(null);
  }

  return (
    <PageShell>
      <TopHeader healthStatus={healthStatus} />

      {error && (
        <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-rose-900">Something went wrong</p>
              <p className="text-sm text-rose-700 mt-1">{error.message}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-700 hover:text-rose-900 text-sm font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          <DocumentUploader
            uploadedFile={uploadedFile}
            isUploading={isUploading}
            onUpload={onUpload}
            onReset={resetAll}
          />

          <FieldBuilder
            fields={fields}
            setFields={setFields}
            batchExtraction={batchExtraction}
            setBatchExtraction={setBatchExtraction}
            canExtract={Boolean(docId)}
            isExtracting={isExtracting}
            onExtract={onExtract}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <ExtractionResults isExtracting={isExtracting} extractionResult={extractionResult} />
        </div>
      </div>
    </PageShell>
  );
}
