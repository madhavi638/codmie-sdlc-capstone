export function uniqueEmail(prefix = 'wms.qa') {
  // Parallel workers can share a millisecond, and app.py rejects duplicate emails,
  // so mix in a random suffix.
  const ts = `${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}+${ts}@example.com`;
}

export function uniqueName(prefix = 'QA User') {
  const ts = Date.now();
  return `${prefix} ${ts}`;
}

export function uniqueEmployee(prefix = 'Employee') {
  const ts = Date.now();
  return `${prefix} ${ts}`;
}
