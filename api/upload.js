import Busboy from "busboy";
import { createClient } from "@supabase/supabase-js";
import { analizarExcelDesdeBuffer } from "./read-excel.js";

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

  let uploadPromise = null;
  let analysisResult = null;

busboy.on("file", (fieldname, file, info) => {
  const { filename, mimeType } = info;
  let chunks = [];

  file.on("data", (chunk) => {
    chunks.push(chunk);
  });

  file.on("end", async () => {
    const buffer = Buffer.concat(chunks);

    // 1️⃣ Subir archivo a Supabase
    uploadPromise = supabase.storage
      .from("uploads")
      .upload(`files/${Date.now()}-${filename}`, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    // 2️⃣ Analizar Excel
    analysisResult = analizarExcelDesdeBuffer(buffer);
  });
});


  busboy.on("finish", async () => {
    if (!uploadPromise) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    const { data, error } = await uploadPromise;

    if (error) {
      return res
        .status(500)
        .json({ error: "Error al subir archivo", detail: error });
    }

    return res.status(200).json({
      message: "Archivo subido correctamente",
      file: data,
      analysis: analysisResult,
      
    });
  });

  req.pipe(busboy);
}
