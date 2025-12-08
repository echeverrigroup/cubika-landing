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

  // 🔥 Corrección: usar variables backend correctas
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const busboy = Busboy({ headers: req.headers });

  let uploadPromise = null;

  busboy.on("file", (fieldname, file, filename) => {
    let chunks = [];

    file.on("data", (chunk) => {
      chunks.push(chunk);
    });

    file.on("end", () => {
      const finalBuffer = Buffer.concat(chunks);

      // 🔥 bucket corregido: usa variable para evitar errores
      uploadPromise = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(`files/${Date.now()}-${filename}`, finalBuffer, {
          contentType: "application/octet-stream",
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
      return res.status(500).json({ error: "Error al subir archivo", detail: error });
    }

    return res.status(200).json({
      message: "Archivo subido correctamente",
      file: data,
    });
  });

  req.pipe(busboy);
}
