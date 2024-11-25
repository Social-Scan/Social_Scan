from django import forms
from .models import Product  # Ensure Product model exists

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['title', 'description', 'price', 'image', 'video']
