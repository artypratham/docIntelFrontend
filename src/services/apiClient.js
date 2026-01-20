export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = "Request failed";

    try {
      const data = isJson ? await res.json() : await res.text();
      message = data?.detail || data?.message || String(data) || message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return isJson ? await res.json() : await res.text();
}
