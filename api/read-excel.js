import * as XLSX from "xlsx";

/**
 * Detecta automáticamente la fila que corresponde a los encabezados reales
 * usando heurística de densidad y tipo de datos.
 */
function detectarFilaEncabezados(rows, minColumnas = 3) {

  let mejorFila = null;
  let mejorScore = -Infinity;

  rows.forEach((row, index) => {

    if (!row || row.length < minColumnas) return;

    let noVacios = 0;
    let strings = 0;
    let numeros = 0;
    let largos = 0;

    row.forEach((cell) => {

      if (cell !== null && cell !== undefined && cell !== "") {

        noVacios++;

        if (typeof cell === "string") {

          strings++;

          if (cell.length > 3) {
            largos++;
          }

        }

        if (typeof cell === "number") {
          numeros++;
        }

      }

    });

    // heurística mejorada
    let score =
      (noVacios * 2) +
      (strings * 2) +
      largos -
      (numeros * 2);

    if (noVacios >= minColumnas && score > mejorScore) {
      mejorScore = score;
      mejorFila = index;
    }

  });

  return mejorFila;
}

/**
 * Lee un archivo Excel desde buffer
 * y devuelve análisis estructural
 */
export function analizarExcelDesdeBuffer(buffer) {

  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null
  });

  const headerRowIndex = detectarFilaEncabezados(rows);

  let headers = [];

  if (
    headerRowIndex !== null &&
    rows[headerRowIndex] &&
    Array.isArray(rows[headerRowIndex])
  ) {
    headers = rows[headerRowIndex]
      .map(cell => (typeof cell === "string" ? cell.trim() : null))
      .filter(cell => cell && cell.length > 0);
  }

  console.log("Header row detectada:", headerRowIndex);
  console.log("Fila completa:", rows[headerRowIndex]);
  
    
  return {
    headerRowIndex,
    headers,
    rows
  };

}
