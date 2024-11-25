import tensorflow as tf
import cv2
import numpy as np

# Load pre-trained COCO model (Object Detection)
model_path = "E:/social_to_amazon/stm/listings/ssd_mobilenet_v2_320x320_coco17_tpu-8/saved_model"

model = tf.saved_model.load(model_path)
print(f"Model loaded from {model_path}")


# Function to perform object detection on image
def detect_objects(image_path):
    # Read image
    print(f"Reading image from: {image_path}")
    image_np = cv2.imread(image_path)

    if image_np is None:
        print("Error: Image not found.")
        return []

    image_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)

    input_tensor = tf.convert_to_tensor(image_rgb)
    input_tensor = input_tensor[tf.newaxis, ...]

    # Perform detection
    detections = model(input_tensor)
    print("Detection output keys:", detections.keys())

    # Extract objects
    objects = detections['detection_classes'][0].numpy()
    return objects
