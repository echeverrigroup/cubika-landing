import Busboy from "busboy";
import { createClient } from "@supabase/supabase-js";
import { analizarExcelDesdeBuffer } from "./read-excel.js";
import { detectarColumnas } from "./column-mapper.js";
import { normalizarTabla } from "./table-normalizer.js";
import { validarRegistros } from "./logistics-validator.js";
import { normalizarDatosLogisticos } from "./logistics-normalizer.js";
import { generarDiagnostico } from "./diagnostic-engine.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const busboy = Busboy({ headers: req.headers });

  let uploadPromise;
  let analysisResult;

  // 🔒 Promesa que garantiza que el archivo fue procesado
  const fileProcessed = new Promise((resolve, reject) => {
    busboy.on("file", (fieldname, file, info) => {
      const { filename, mimeType } = info;
      const chunks = [];

      file.on("data", chunk => chunks.push(chunk));

      file.on("end", () => {
        try {
          const buffer = Buffer.concat(chunks);

          // 1️⃣ Analizar Excel
          analysisResult = analizarExcelDesdeBuffer(buffer);

          console.log("ANALYSIS RESULT:", analysisResult);
          
          // 2️⃣ Detectar columnas logísticas
          const columnMap = detectarColumnas(analysisResult.headers);
          
          // 3️⃣ Normalizar tabla
          const tablaNormalizada = normalizarTabla(
            analysisResult.rows,
            analysisResult.headerRowIndex,
            columnMap
          );
          
          // 4️⃣ Validar registros
          const validacion = validarRegistros(tablaNormalizada);
          
          // 5️⃣ Normalizar datos logísticos
          const datosLogisticos = normalizarDatosLogisticos(validacion.validRows);
          
          // 6️⃣ Generar diagnóstico
          const diagnostico = generarDiagnostico({
            headers: analysisResult.headers,
            columnMap,
            totalRows: tablaNormalizada.length,
            validRows: validacion.validRows.length,
            invalidRows: validacion.invalidRows.length
          });
          
          // guardar en analysisResult para devolverlo al frontend
          analysisResult.pipeline = {
            columnMap,
            diagnostico,
            preview: datosLogisticos.slice(0, 10)
          };
          // Subir archivo
          uploadPromise = supabase.storage
            .from("uploads")
            .upload(`files/${Date.now()}-${filename}`, buffer, {
              contentType: mimeType,
              upsert: false,
            });

          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  busboy.on("finish", async () => {
    try {
      // ⏳ Espera real al procesamiento del archivo
      await fileProcessed;

      const { data, error } = await uploadPromise;

      if (error) {
        return res.status(500).json({
          error: "Error al subir archivo",
          detail: error,
        });
      }

      return res.status(200).json({
        message: "Archivo subido correctamente",
        file: data,
        analysis: analysisResult,

  
      });

    } catch (err) {
      return res.status(500).json({
        error: "Error procesando archivo",
        detail: err.message,
      });
    }
  });

  req.pipe(busboy);
}
