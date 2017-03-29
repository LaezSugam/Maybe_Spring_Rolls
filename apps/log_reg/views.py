from django.shortcuts import render, redirect
from django.contrib import messages
from models import Users

# Create your views here.
def index(request):

    return render(request, "log_reg/index.html")

def register(request):

    new_user = Users.objects.add_user(request.POST)

    if new_user[0]:
        request.session["current_user"] = {
        "id" : new_user[1].id,
        "first_name" : new_user[1].first_name,
        "last_name" : new_user[1].last_name
        }
        return redirect("log_reg:success")
    else:
        for mes in new_user[1]:
            messages.error(request, mes)
        return redirect("log_reg:index")

def login(request):

    login_attempt = Users.objects.login(request.POST)

    if login_attempt[0]:
        request.session["current_user"] = {
        "id" : login_attempt[1].id,
        "first_name" : login_attempt[1].first_name,
        "last_name" : login_attempt[1].last_name
        }
        return redirect("log_reg:success")
    else:
        messages.error(request, login_attempt[1])
        return redirect("log_reg:index")

def logout(request):

    del request.session["current_user"]

    return redirect("/")

def success(request):

    if "current_user" not in request.session:
        return redirect("log_reg:index")

    return render(request, "log_reg/success.html")
