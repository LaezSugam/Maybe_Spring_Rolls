
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name = "index"),
    url(r'^addmeal$', views.add_meal, name = "add_meal"),
    url(r'^removemeal/(?P<meal_id>\d+)$', views.remove_meal, name = "remove_meal"),
]
