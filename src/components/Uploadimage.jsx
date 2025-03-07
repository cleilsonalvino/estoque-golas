import { useState } from "react";

export default function UploadImagem() {
  const [imagem, setImagem] = useState(null);
  const [urlImagem, setUrlImagem] = useState("");

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imagem) return alert("Selecione uma imagem primeiro!");

    const reader = new FileReader();
    reader.readAsDataURL(imagem);
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];

      const resposta = await fetch("https://api.github.com/repos/SEU_USUARIO/SEU_REPO/contents/imagens/" + imagem.name, {
        method: "PUT",
        headers: {
          "Authorization": "token SEU_GITHUB_TOKEN",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Upload de imagem",
          content: base64
        })
      });

      const data = await resposta.json();
      if (data.content?.download_url) {
        setUrlImagem(data.content.download_url);
      } else {
        alert("Erro ao fazer upload!");
      }
    };
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Fazer Upload</button>
      {urlImagem && <img src={urlImagem} alt="Imagem carregada" width="200" />}
    </div>
  );
}
