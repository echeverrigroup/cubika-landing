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
