from __future__ import unicode_literals

from django.db import models

from ..log_reg.models import Users

# Create your models here.
class meal(models.Model):
    user = models.ForeignKey(Users, related_name="user_meals")
    meal = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
