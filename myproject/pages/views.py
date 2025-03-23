from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import joblib
import os

# Load the trained model once (adjust path if needed)
model_path = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')
model = joblib.load(model_path)

@csrf_exempt
def predict_risk(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract vitals from POSTed JSON
            hr = data.get('hr')
            bpS = data.get('bpS')
            bpD = data.get('bpD')
            spo2 = data.get('spo2')

            features = [[hr, bpS, bpD, spo2]]
            prediction = model.predict(features)[0]

            return JsonResponse({'risk_level': int(prediction)})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)

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

model_path = os.path.join(os.path.dirname(__file__), 'risk_model.pkl')
model = joblib.load(model_path)

@csrf_exempt
def predict_risk(request):
    if request.method == "POST":
		
        try:
            data = json.loads(request.body)
			
            # Extract vitals from POSTed JSON
            hr = data.get('hr')
            bpS = data.get('bpS')
            bpD = data.get('bpD')
            spo2 = data.get('spo2')

            features = [[hr, bpS, bpD, spo2]]
            prediction = model.predict(features)[0]
			
            return JsonResponse({'risk_level': int(prediction)})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)