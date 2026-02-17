import { useState } from "react";

export default function UploadSection({ onUpload }) {
  const [imageURL, setImageURL] = useState("");

  const handleURLSubmit = () => {
    if (imageURL.trim() !== "") {
      onUpload(imageURL, true);
    }
  };

  return (
    <div className="card">
      <h3>Upload Image</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e.target.files[0], false)}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
        <input
          type="text"
          placeholder="Paste image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
        <button onClick={handleURLSubmit}>Search</button>
      </div>
    </div>
  );
}
