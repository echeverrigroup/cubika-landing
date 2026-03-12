export function validarRegistros(tabla) {

  const validos = [];
  const errores = [];

  tabla.forEach((registro, index) => {

    const erroresFila = [];

    // SKU obligatorio
    if (!registro.sku || registro.sku === "") {
      erroresFila.push("SKU vacío");
    }

    // Cantidad válida
    if (registro.quantity !== null) {

      const cantidad = Number(registro.quantity);

      if (isNaN(cantidad) || cantidad <= 0) {
        erroresFila.push("Cantidad inválida");
      }

    }

    // Peso válido
    if (registro.weight !== null) {

      const peso = Number(registro.weight);

      if (isNaN(peso) || peso < 0) {
        erroresFila.push("Peso inválido");
      }

    }

    if (erroresFila.length > 0) {

      errores.push({
        fila: index + 1,
        registro,
        errores: erroresFila
      });

    } else {

      validos.push(registro);

    }

  });

  return {
    validos,
    errores
  };

}
