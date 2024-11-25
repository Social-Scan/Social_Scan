from django.db import models

class Product(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='product_images/')
    video = models.FileField(upload_to='product_videos/', null=True, blank=True)
    amazon_url = models.URLField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.title
