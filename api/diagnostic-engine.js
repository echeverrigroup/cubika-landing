// ==============================
// DIAGNOSTIC ENGINE
// ==============================

export function generarDiagnostico({
  headers,
  columnMap,
  totalRows,
  validRows,
  invalidRows
}) {

  return {

    headers_detected: headers,

    columns_detected: columnMap,

    rows_total: totalRows,

    rows_valid: validRows,

    rows_invalid: invalidRows,

    timestamp: new Date().toISOString()

  };

}
