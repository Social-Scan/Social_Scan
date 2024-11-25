import React, { useState } from 'react';
import axios from 'axios';

function ImageClassifier() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [searchLinks, setSearchLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5 MB!');
      return;
    }
    setError(null);
    setSelectedFile(file);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post($,{API_BASE_URL}/classify, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPredictions(response.data.predictions);
      setSearchLinks(response.data.searchLinks);
    } catch (err) {
      console.error('Classification error:', err);
      setError('An error occurred while classifying the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-classifier">
      <h1>Image Classification App</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!selectedFile || loading}>
          {loading ? 'Classifying...' : 'Classify Image'}
        </button>
      </form>

      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="Preview of uploaded file" style={{ maxWidth: '100%' }} />
        </div>
      )}

      {predictions.length > 0 && (
        <div className="results">
          <h2>Predictions</h2>
          {predictions.map((pred, index) => (
            <div key={index}>
              <p>
                {pred.class}: {(pred.probability * 100).toFixed(2)}%
              </p>
            </div>
          ))}

          <h2>Search Links</h2>
          {searchLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageClassifier;