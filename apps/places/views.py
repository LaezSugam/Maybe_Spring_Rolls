from django.shortcuts import render, redirect
from django.contrib import messages
from models import Meal
from ..log_reg.models import Users
import simplejson

# Create your views here.
def index(request):

    restaurant_types = ["American", "Italian", "Vietnamese", "German", "Japanese", "Vegan", "Greek", "Chinese", "Irish"]

    context = {
    "distance_loop" : range(2, 32),
    "restaurant_types" : restaurant_types,
    }

    try:
        if request.session["current_user"]:
            if Meal.objects.filter(user=Users.objects.get(id=request.session["current_user"]["id"])):
                context["meal_list"] = Meal.objects.filter(user=Users.objects.get(id=request.session["current_user"]["id"]))
                js_meal_temp = {}
                for meal in context["meal_list"]:
                    js_meal_temp[meal.meal] = meal.meal
                context["meals_for_js"] = simplejson.dumps(js_meal_temp)
    except KeyError:
        return render(request, "places/index.html", context)

    return render(request, "places/index.html", context)

def add_meal(request):

    if request.method == "POST":
        meal = Meal.objects.add_meal(request.POST, request.session["current_user"]["id"])

        if not meal[0]:
            for mes in meal[1]:
                messages.error(request, mes)

    return redirect("places:index")

def remove_meal(request, meal_id):

    if request.method == "POST":
        messages.success(request, Meal.objects.remove_meal(meal_id))

    return redirect("places:index")
