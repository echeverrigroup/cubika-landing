import Busboy from "busboy";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

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
  

  busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const chunks = [];

    file.on("data", (chunk) => chunks.push(chunk));

    file.on("end", () => {
      const finalBuffer = Buffer.concat(chunks);
    
      // 1️⃣ LEER EL EXCEL
      const workbook = XLSX.read(finalBuffer, { type: "buffer" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
    
      // 2️⃣ CONVERTIR A MATRIZ
      const sheetData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
      });
    
      // 3️⃣ DETECTAR ENCABEZADOS
      let headers = [];
    
      for (const row of sheetData) {
        const validCells = row.filter(
          (cell) => typeof cell === "string" && cell.trim() !== ""
        );
    
        if (validCells.length >= 2) {
          headers = row;
          break;
        }
      }
    
      // 4️⃣ SUBIR ARCHIVO A SUPABASE (LO QUE YA FUNCIONABA)
      uploadPromise = supabase.storage
        .from("uploads")
        .upload(`files/${Date.now()}-${filename}`, finalBuffer, {
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          upsert: false,
        });
    
      // 5️⃣ GUARDAR HEADERS PARA RESPUESTA
      req.detectedHeaders = headers;
    });

    
  });


  busboy.on("finish", async () => {
    if (!uploadPromise) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    const { data, error } = await uploadPromise;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Archivo subido correctamente",
      file: data,
      headers: req.detectedHeaders || [],

      
    });
  });

  req.pipe(busboy);
}
