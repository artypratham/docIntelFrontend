import { ENV } from "../config/env.js";
import { apiFetch } from "./apiClient.js";

export const documentApi = {
  health: () => apiFetch(`${ENV.API_BASE_URL}/health`),

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch(`${ENV.API_BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData
    });
  },

  extract: async (docId, schema, batchExtraction = false) => {
    return apiFetch(`${ENV.API_BASE_URL}/documents/${docId}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schema, batch_extraction: Boolean(batchExtraction) })
    });
  }
};

//Updated baseurl path on 27th Jan 2026.