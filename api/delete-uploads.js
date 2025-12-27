import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { files } = req.body;

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "Archivos inválidos" });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Ajustar paths al bucket
  const paths = files.map(name => `files/${name}`);

  const { error } = await supabase
    .storage
    .from("uploads")
    .remove(paths);

  if (error) {
    return res.status(500).json({ error: "Error eliminando archivos", detail: error });
  }

  return res.status(200).json({ success: true });
}
