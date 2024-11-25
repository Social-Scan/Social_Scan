# matcher/admin.py
from django.contrib import admin
from .models import Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'amazon_link')  # Fields to display in the admin list view
    search_fields = ('name', 'description')  # Allow search by name and description

admin.site.register(Product, ProductAdmin)
