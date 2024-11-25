from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', views.upload_file, name='upload'),
    path('results/', views.show_results, name='results'),
    path('text-post/', views.process_text_post, name='text_post'),
]
