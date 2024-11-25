![WhatsApp Image 2024-11-25 at 21 25 45_a4360598](https://github.com/user-attachments/assets/7d6be9c5-245d-43cb-a1e2-f0d25a49d538)
---
## *1. Project Setup*

### *Pre-requisites*
1. *Install Required Software:*
   - Python (version 3.8 or above)
   - Django (latest stable version)
   - Node.js (for handling front-end dependencies if needed)

2. *System Requirements*:
   - Recommended: 16GB RAM, i5/i7 processor, and a dedicated GPU if you expand object detection.

3. *APIs and Tokens*:
   - Get an *Apify API token* for fetching Amazon product listings.
   - Install pytesseract for OCR processing.
   - Install libraries like opencv-python and Pillow for image processing.

---

### *Step 1: Clone the Project*
Clone the project repository or move the project files to your system.
bash
git clone <your-repo-url>
cd social_to_amazon


---

### *Step 2: Set Up the Virtual Environment*
Set up and activate a virtual environment to manage Python dependencies:
bash
python -m venv .venv
source .venv/bin/activate  
# On Windows: .venv\Scripts\activate


---

### *Step 3: Install Dependencies*
Install all required Python libraries using the provided requirements.txt file:
bash
pip install -r requirements.txt


Add the required libraries if missing:
bash
pip install django opencv-python Pillow pytesseract requests


---

### *Step 4: Set Up the Django Project*
1. *Migrate the Database*:
   Run migrations to set up the database:
   bash
   python manage.py migrate
   

2. *Create a Superuser*:
   Create a Django admin superuser account:
   bash
   python manage.py createsuperuser
   

3. *Update API Tokens*:
   Open amazon_plugin.py and replace <YOUR_APIFY_TOKEN> with your actual Apify API token:
   python
   plugin = PPlugin(apify_token="<YOUR_APIFY_TOKEN>")
   

4. *Set Up Static Files*:
   Collect static files:
   bash
   python manage.py collectstatic
   

---

## *2. Running the Project*

### *Step 1: Start the Development Server*
Run the server locally:
bash
python manage.py runserver


### *Step 2: Open the Web App*
Visit http://127.0.0.1:8000 in your browser to open the application.

---

## *3. Workflow*

### *How It Works*
#### *Frontend (Social Media Post Integration)*
1. *Floating Plugin*:
   - A *floating Amazon plugin* appears in the corner of every social media post (image, text, or video) on the web app.
   - The plugin is implemented using JavaScript (static/js/floating_plugin.js) and styled using CSS (static/css/floating_plugin.css).

2. *On Click*:
   - When the plugin is clicked, it sends a request to the backend (/fetch-product-listing/) to analyze the post and fetch related Amazon products.
  
![WhatsApp Image 2024-11-25 at 20 49 22_d2acd38b](https://github.com/user-attachments/assets/735b58a8-257a-46b0-849e-2cca33ab12b5)
---

#### *Backend (Processing and Amazon Integration)*
1. *OCR and Object Detection*:
   - The uploaded or fetched social media post image is processed using pytesseract for OCR.
   - Keywords are extracted and sent to the Amazon plugin for product searching.

2. *Amazon Product Fetching*:
   - The keywords are used to query Amazon via Apify API, fetching a list of related products.
   - The products are returned as JSON to the frontend.

3. *Product Listing Modal*:
   - The frontend displays the fetched Amazon products in a modal, showing the product name, price, and link.

![WhatsApp Image 2024-11-25 at 20 49 20_c09bdc46](https://github.com/user-attachments/assets/4a9c34b7-3891-4319-8fd0-ff5d38f7bc0b)

---

## *4. Testing*

### *Unit Testing*
- Test OCR functionality:
  bash
  python manage.py test app.tests.TestOCR
  
- Test Amazon API integration:
  bash
  python manage.py test app.tests.TestAmazonAPI
  

### *Manual Testing*
1. Upload a sample post (image) to static/images/.
2. Verify if the plugin appears on the post.
3. Click on the plugin and ensure product listings appear.

---

## *5. Deployment*

### *Step 1: Prepare for Deployment*
1. Set DEBUG=False in settings.py for production.
2. Add your domain or IP to ALLOWED_HOSTS in settings.py.

### *Step 2: Deploy on a Server*
Use platforms like:
- *Heroku*
- *AWS EC2*
- *DigitalOcean*

### *Step 3: Static Files Hosting*
Serve static files using a service like *Amazon S3* or *Cloudflare*.

---

## *6. Key Features*

1. *Image Posts*:
   - OCR processes the text in images.
   - Displays products related to the text.

2. *Text Posts*:
   - (To be implemented): Uses NLP to extract product-related keywords.

3. *Video Posts*:
   - (To be implemented): Frame analysis to detect objects/products in the video.

---

## *7. Known Limitations*
1. Text and video post processing are not fully implemented.
2. Relies on Apify API for product data; availability may vary.
