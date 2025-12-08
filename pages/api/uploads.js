export const config = {
  api: {
    bodyParser: false, // Necesario para manejar FormData
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Como aún NO vamos a guardar archivos, solo validamos que llegó el FormData
    res.status(200).json({
      message: "File received correctly",
      method: req.method,
      note: "Aún no estamos guardando archivos, solo confirmando recepción."
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
