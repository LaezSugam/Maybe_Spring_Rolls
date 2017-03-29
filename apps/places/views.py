from django.shortcuts import render

# Create your views here.
def index(request):

    restaurant_types = ["American", "Italian", "Vietnamese", "German", "Japanese", "Vegan", "Greek", "Chinese", "Irish"]

    context = {
    "distance_loop" : range(2, 32),
    "restaurant_types" : restaurant_types
    }

    return render(request, "places/index.html", context)
