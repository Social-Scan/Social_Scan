const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());

// Load TensorFlow Model
let model;
async function loadModel() {
  model = await tf.loadLayersModel('https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/4');
}
loadModel();

// Image Preprocessing
async function preprocessImage(imagePath) {
  const image = await Jimp.read(imagePath);
  image.resize(224, 224);
  const imageData = new Uint8Array(224 * 224 * 3);
  
  image.scan(0, 0, 224, 224, function (x, y, idx) {
    imageData[idx] = this.bitmap.data[idx];
    imageData[idx + 1] = this.bitmap.data[idx + 1];
    imageData[idx + 2] = this.bitmap.data[idx + 2];
  });

  return tf.tensor4d(imageData, [1, 224, 224, 3]).div(tf.scalar(255));
}

// Decode Predictions
function decodePredictions(preds) {
  const classes = require('@tensorflow/tfjs-node/dist/keras/imagenet_classes.json');
  return Array.from(preds.dataSync())
    .map((pred, index) => ({
      class: classes[index],
      probability: pred
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);
}

// Image Classification Endpoint
app.post('/classify', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const imgTensor = await preprocessImage(imagePath);
    const predictions = model.predict(imgTensor);
    const decodedPredictions = decodePredictions(predictions);

    // Generate search links
    const searchQuery = decodedPredictions[0].class;
    const links = [
      { name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${searchQuery}` },
      { name: 'YouTube', url: `https://www.youtube.com/results?search_query=${searchQuery}` },
      { name: 'Google', url: `https://www.google.com/search?q=${searchQuery}` }
    ];

    res.json({
      predictions: decodedPredictions,
      searchLinks: links
    });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Image classification failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});