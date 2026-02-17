export default function ImagePreview({ image }) {
  if (!image) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Uploaded Image</h3>
      <img src={image} alt="Uploaded" width="200" />
    </div>
  );
}
