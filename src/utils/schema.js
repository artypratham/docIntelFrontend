export function buildJsonSchema(fields) {
  const validFields = fields.filter((f) => f.name?.trim() && f.description?.trim());

  const schema = { type: "object", properties: {} };

  for (const field of validFields) {
    schema.properties[field.name.trim()] = {
      type: field.type,
      description: field.description.trim()
    };
  }

  return { schema, validFields };
}
