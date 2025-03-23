"""trydjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pages import views

from pages.views import home_view, service_opportunities_view, service_match_view, social_view

urlpatterns = [
    path('', home_view, name='home'),  # Home Page
    path('service-opportunities/', service_opportunities_view, name='service_opportunities'),  # Service Opportunities
    path('Patients/', service_match_view, name='Patients'), 
    path('service-match/', service_match_view, name='service_match'),
    path('new patients/', social_view, name='new_patients'),  # Service Match
    path('api/predict/', views.predict_risk, name='predict_risk')
]
