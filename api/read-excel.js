import * as XLSX from "xlsx";

/**
 * Detecta automáticamente la fila que corresponde a los encabezados reales
 * usando heurística de densidad y tipo de datos.
 */
function detectarFilaEncabezados(rows, minColumnas = 3) {
  let mejorFila = null;
  let mejorScore = 0;

  rows.forEach((row, index) => {
    if (!row || row.length < minColumnas) return;

    let noVacios = 0;
    let strings = 0;

    row.forEach((cell) => {
      if (cell !== null && cell !== undefined && cell !== "") {
        noVacios++;
        if (typeof cell === "string") strings++;
      }
    });


    // Heurística simple pero robusta
    const score = noVacios * 2 + strings;

    if (noVacios >= minColumnas && score > mejorScore) {
      mejorScore = score;
      mejorFila = index;
    }
  });

  return mejorFila;
}

/**
 * Lee un archivo Excel desde un buffer y devuelve:
 * - índice de la fila de encabezados
 * - nombres de las columnas
 */
export function analizarExcelDesdeBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  });

  const headerRowIndex = detectarFilaEncabezados(rows);

  let headers = [];

if (headerRowIndex !== null) {
  headers = rows[headerRowIndex]
    .map(cell =>
      typeof cell === "string" ? cell.trim() : null
    )
    .filter(cell => cell && cell.length > 0);
}

return {
  headerRowIndex,
  headers,
};

}
