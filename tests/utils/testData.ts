export function uniqueEmail(prefix = 'wms.qa') {
  const ts = Date.now();
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
