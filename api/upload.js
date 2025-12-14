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

 busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info;
    const chunks = [];

    file.on("data", (chunk) => chunks.push(chunk));

    file.on("end", () => {
      const buffer = Buffer.concat(chunks);

      uploadPromise = supabase.storage
        .from("uploads")
        .upload(`files/${Date.now()}-${filename}`, buffer, {
          contentType: mimeType,
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
