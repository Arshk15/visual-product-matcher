export default function FilterSlider({ threshold, setThreshold }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label>Similarity Filter: {threshold.toFixed(2)}</label>
      <br />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value))}
      />
    </div>
  );
}
