# listings/views.py
from django.shortcuts import render

def home(request):
    return render(request, 'listings/home.html')
