from __future__ import unicode_literals

from django.db import models

from ..log_reg.models import Users

# Create your models here.
class MealManager(models.Manager):

    def add_meal(self, postData, user_id):
        errors = []

        if len(postData["meal"]) < 1:
            errors.append("The meal field cannot be blank.")

        if not errors:

            self.create(user=Users.objects.get(id=user_id), meal=postData["meal"])
            return (True, "Meal added successfully!")
        else:
            return (False, errors)

    def remove_meal(self, meal_id):

        self.get(id=meal_id).delete()
        return("Meal successfully deleted.")


class Meal(models.Model):
    user = models.ForeignKey(Users, related_name="user_meals")
    meal = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = MealManager()
