export function normalizarTabla(rows, headerRowIndex, columnasDetectadas) {

  const headers = rows[headerRowIndex];
  const dataRows = rows.slice(headerRowIndex + 1);

  const resultado = [];

  dataRows.forEach(row => {

    if (!filaValida(row)) return;

    const registro = {};

    for (const campo in columnasDetectadas) {

      const headerOriginal = columnasDetectadas[campo];

      const colIndex = headers.findIndex(
        h => h === headerOriginal
      );

      registro[campo] = row[colIndex] ?? null;

    }

    resultado.push(registro);

  });

  return resultado;

}

function filaValida(row) {

  if (!row) return false;

  let noVacios = 0;

  row.forEach(cell => {

    if (cell !== null && cell !== undefined && cell !== "") {
      noVacios++;
    }

  });

  // Si la fila tiene muy pocos datos, probablemente no es tabla
  if (noVacios < 2) return false;

  return true;

}
