// Manifest-driven config validation.
// Returns { config, errors }: config has unknown keys stripped and only
// valid values applied; errors lists every rejected field with a reason.

const SAFE_ASSET_PATH = /^(assets|options)\/[a-zA-Z0-9_\-./ ]+$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000b-\u001f]/; // allows tab + newline

export function validateConfig(manifest, input) {
  const errors = [];
  const config = {};
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { config, errors: [{ field: '*', reason: 'config must be an object' }] };
  }

  const fields = new Map((manifest.fields || []).map(f => [f.key, f]));

  for (const [key, value] of Object.entries(input)) {
    const field = fields.get(key);
    if (!field) {
      errors.push({ field: key, reason: 'unknown field' });
      continue;
    }
    const err = checkField(field, value);
    if (err) errors.push({ field: key, reason: err });
    else config[key] = value;
  }

  return { config, errors };
}

function checkField(field, value) {
  switch (field.type) {
    case 'text': {
      if (typeof value !== 'string') return 'must be a string';
      if (field.max_length && value.length > field.max_length) {
        return `longer than ${field.max_length} characters`;
      }
      if (CONTROL_CHARS.test(value)) return 'contains control characters';
      return null;
    }
    case 'image': {
      if (typeof value !== 'string') return 'must be a string';
      if (value.includes('..') || !SAFE_ASSET_PATH.test(value)) return 'not a valid asset path';
      return null;
    }
    case 'multi_select': {
      if (!Array.isArray(value)) return 'must be an array';
      const allowed = new Set((field.options || []).map(o => o.value));
      if (value.some(v => !allowed.has(v))) return 'contains values not in options';
      if (new Set(value).size !== value.length) return 'contains duplicates';
      if (field.min && value.length < field.min) return `needs at least ${field.min} selections`;
      if (field.max && value.length > field.max) return `allows at most ${field.max} selections`;
      return null;
    }
    default:
      return `unsupported field type "${field.type}"`;
  }
}
