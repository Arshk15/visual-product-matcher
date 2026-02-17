export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-content">
        <h4>{product.name}</h4>
        <p>{product.category}</p>
        <p className="similarity">
          Similarity: {product.similarity?.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
