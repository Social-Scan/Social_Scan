import os
import torch
from transformers import DetrImageProcessor, DetrForObjectDetection
from django.shortcuts import render
from django.http import JsonResponse
from PIL import Image
from .models import Product
from django.conf import settings
from .plugin import PPlugin


# Function for product detection using the DETR model
def detect_objects(image_path):
    """
    Detect objects in the image using the DETR model.
    """
    # Load pre-trained DETR model and processor
    processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50")
    model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50")

    # Open the image
    image = Image.open(image_path)

    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")

    # Perform object detection
    outputs = model(**inputs)
    target_sizes = torch.tensor([image.size[::-1]])  # image.size is (width, height)
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.9)[0]

    # Return the detected objects and their bounding boxes
    detected_objects = []
    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        detected_objects.append({
            "score": score.item(),
            "label": model.config.id2label[label.item()],
            "box": box.tolist()
        })

    return detected_objects

# Function to handle image upload and object detection
def upload_image(request):
    if request.method == "POST" and request.FILES.get("social_media_image"):
        image = request.FILES["social_media_image"]
        image_path = os.path.join(settings.MEDIA_ROOT, "images", image.name)

        with open(image_path, "wb") as f:
            for chunk in image.chunks():
                f.write(chunk)

        # Process the image and detect objects
        detected_objects = detect_objects(image_path)

        # Render the results (You can modify the template to display bounding boxes on the image)
        return render(request, "results.html", {"image_results": detected_objects, "image_url": image_path})

    return render(request, "index.html")

# Function to handle video upload and object detection
def upload_video(request):
    if request.method == "POST" and request.FILES.get("social_media_video"):
        video = request.FILES["social_media_video"]
        video_path = os.path.join(settings.MEDIA_ROOT, "videos", video.name)

        with open(video_path, "wb") as f:
            for chunk in video.chunks():
                f.write(chunk)

        # Process the video and detect objects in each frame
        detected_objects = detect_objects_in_video(video_path)

        # Render the results (You can modify the template to display bounding boxes on each frame)
        return render(request, "results.html", {"video_results": detected_objects, "video_url": video_path})

    return render(request, "index.html")


# Function for handling text-based product identification
def process_text_post(request):
    if request.method == 'POST':
        text_post = request.POST.get('text')
        if text_post:
            plugin = PPlugin()
            try:
                plugin.identification(text_post)
                return JsonResponse({'message': 'Product search completed successfully.'})
            except Exception as e:
                return JsonResponse({'error': str(e)})

    return render(request, 'text_post.html')


# Function to show results (for both image/video and text posts)
def show_results(request):
    return render(request, 'results.html')


# Index view (for the main landing page)
def index(request):
    return render(request, 'index.html')

