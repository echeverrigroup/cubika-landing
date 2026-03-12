// ==============================
// MODELO SEMÁNTICO CUBIKA
// ==============================

export const CUBIKA_MODEL = {
  sku: [
    "sku",
    "codigo",
    "cod",
    "cod_producto",
    "producto",
    "item",
    "codigo producto",
    "codigo_producto"
  ],

  quantity: [
    "cantidad",
    "qty",
    "unidades",
    "cant",
    "cantidad pedida"
  ],

  weight: [
    "peso",
    "kg",
    "kilos",
    "weight",
    "peso kg"
  ],

  description: [
    "descripcion",
    "detalle",
    "nombre producto"
  ],

  client: [
    "cliente",
    "destinatario"
  ],

  address: [
    "direccion",
    "direccion entrega",
    "direccion destino"
  ]
};



// ==============================
// NORMALIZADOR DE TEXTO
// ==============================

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}



// ==============================
// DETECTOR SEMÁNTICO
// ==============================

export function detectarColumnas(headers) {

  const resultado = {};

  headers.forEach(header => {

    const limpio = normalizar(header);

    for (const campo in CUBIKA_MODEL) {

      const sinonimos = CUBIKA_MODEL[campo];

      const match = sinonimos.find(s =>
        limpio.includes(normalizar(s))
      );

      if (match) {
        resultado[campo] = header;
        break;
      }

    }

  });

  return resultado;

}
