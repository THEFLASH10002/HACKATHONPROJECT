from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def home_view(request, *args, **kwargs):
	print(args, kwargs)
	print(request.user)
	return render(request, "index.html", {})

def service_opportunities_view(request, *args, **kwargs):
	print(args, kwargs)
	print(request.user)
	return render(request, "service opp.html", {})


def service_match_view(request, *args, **kwargs):
	print(args, kwargs)
	print(request.user)
	return render(request, "match.html", {})


def social_view(request, *args, **kwargs):
	print(args, kwargs)
	print(request.user)
	return render(request, "new patients.html", {})