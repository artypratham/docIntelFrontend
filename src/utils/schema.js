export function buildJsonSchema(fields) {
  const validFields = fields.filter((f) => f.name?.trim() && f.description?.trim());

  // Match backend Swagger shape as closely as possible
  // (FastAPI expects request body: { schema: { type, properties, required: [] } })
  const schema = { type: "object", properties: {}, required: [] };

  for (const field of validFields) {
    const name = field.name.trim();
    const description = field.description.trim();

    // UI "date" maps to JSON Schema string+format
    if (field.type === "date") {
      schema.properties[name] = { type: "string", format: "date", description };
      continue;
    }

    schema.properties[name] = { type: field.type, description };
  }

  return { schema, validFields };
}
