import Busboy from "busboy";
import { createClient } from "@supabase/supabase-js";

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

 busboy.on("file", (fieldname, file, filename) => {

  const allowedExtensions = [".xlsx", ".xls"];
  const fileExtension = filename.substring(filename.lastIndexOf(".")).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    file.resume(); // descarta el stream
    return res.status(400).json({
      error: "Formato no permitido. Solo se aceptan archivos Excel (.xlsx, .xls)"
    });
  }

  let chunks = [];

  file.on("data", (chunk) => {
    chunks.push(chunk);
  });

  file.on("end", () => {
    const finalBuffer = Buffer.concat(chunks);

    uploadPromise = supabase.storage
      .from("uploads")
      .upload(`files/${Date.now()}-${filename}`, finalBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: false,
      });
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
      data,
    });
  });

  req.pipe(busboy);
}
