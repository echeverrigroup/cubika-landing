import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  const form = formidable({
    uploadDir: "./uploads",
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error subiendo archivo", error: err });
    }

    return res.status(200).json({ message: "Archivo guardado correctamente", file: files });
  });
}
