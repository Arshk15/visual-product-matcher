import { useEffect, useState } from "react";
import { products } from "./data/products";
import { loadModel } from "./utils/loadModel";
import { cosineSimilarity } from "./utils/cosineSimilarity";
import UploadSection from "./components/UploadSection";
import ImagePreview from "./components/ImagePreview";
import FilterSlider from "./components/FilterSlider";
import ProductGrid from "./components/ProductGrid";

export default function App() {
  const [model, setModel] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [results, setResults] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modelLoading, setModelLoading] = useState(true);

  // Load ML model on mount
  useEffect(() => {
    async function init() {
      try {
        const loadedModel = await loadModel();
        setModel(loadedModel);
      } catch (err) {
        console.error(err);
        setError("Failed to load AI model.");
      } finally {
        setModelLoading(false);
      }
    }

    init();
  }, []);

  // Handle upload
  const handleUpload = async (input, isURL = false) => {
    if (!model) {
      setError("Model not ready yet.");
      return;
    }

    setError("");
    setLoading(true);
    setResults([]);

    const imgURL = isURL ? input : URL.createObjectURL(input);
    setUploadedImage(imgURL);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      try {
        // User image embedding
        const userTensor = model.infer(img, true);
        const userVector = Array.from(userTensor.dataSync());
        userTensor.dispose();

        const similarities = [];

        for (let product of products) {
          const productImg = new Image();
          productImg.crossOrigin = "anonymous";
          productImg.src = product.image;

          await new Promise((resolve, reject) => {
            productImg.onload = resolve;
            productImg.onerror = reject;
          });

          const productTensor = model.infer(productImg, true);
          const productVector = Array.from(productTensor.dataSync());
          productTensor.dispose();

          const similarity = cosineSimilarity(userVector, productVector);

          similarities.push({
            ...product,
            similarity,
          });
        }

        similarities.sort((a, b) => b.similarity - a.similarity);
        setResults(similarities);
      } catch (err) {
        console.error(err);
        setError("Error processing image.");
      } finally {
        setLoading(false);
      }
    };

    img.onerror = () => {
      setError("Invalid image.");
      setLoading(false);
    };

    img.src = imgURL;
  };

  const filteredResults = results.filter(
    (product) => product.similarity >= threshold
  );

  // Show model loading screen
  if (modelLoading) {
    return (
      <div className="container">
        <div className="hero">
          <h1>Visual Product Matcher</h1>
          <p>Loading AI model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hero">
        <h1>Visual Product Matcher</h1>
        <p>Upload. Analyze. Discover similar products instantly.</p>
      </div>

      <UploadSection onUpload={handleUpload} />

      {uploadedImage && <ImagePreview image={uploadedImage} />}

      <FilterSlider threshold={threshold} setThreshold={setThreshold} />

      {loading && <p className="loading">Processing image...</p>}
      {error && <p className="error">{error}</p>}

      <ProductGrid products={filteredResults} />
    </div>
  );
}
