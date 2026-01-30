export function buildJsonSchema(fields) {
  const validFields = fields.filter((f) => f.name?.trim() && f.description?.trim());

  // Match backend Swagger shape as closely as possible
  // (FastAPI expects request body: { extraction_schema: { type, properties, required: [] } })
  const extraction_schema = { type: "object", properties: {}, required: [] };

  for (const field of validFields) {
    const name = field.name.trim();
    const description = field.description.trim();

    // UI "date" maps to JSON Schema string+format
    if (field.type === "date") {
      extraction_schema.properties[name] = { type: "string", format: "date", description };
      continue;
    }

    extraction_schema.properties[name] = { type: field.type, description };
  }

  return { extraction_schema, validFields };
}
