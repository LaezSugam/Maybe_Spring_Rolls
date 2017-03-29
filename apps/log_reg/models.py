from __future__ import unicode_literals

from django.db import models

import re, bcrypt

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
NAME_REGEX = re.compile(r'^[a-zA-Z]+$')

# Create your models here.
class UserManager(models.Manager):
    def add_user(self, postData):
        errors = []
        if len(postData["email"]) < 1:
            errors.append("Email cannot be blank!")
        else:
            if not EMAIL_REGEX.match(postData["email"]):
                errors.append("Invalid Email Address")
        if len(postData["first_name"]) < 2:
            errors.append("First Name must be at least 2 characters")
        else:
            if not NAME_REGEX.match(postData["first_name"]):
                errors.append("First name must contain only letters")
        if len(postData["last_name"]) < 2:
            errors.append("Last Name must be at least 2 characters")
        else:
            if not NAME_REGEX.match(postData["last_name"]):
                errors.append("Name must contain only letters")
        if len(postData["password"]) < 8:
            errors.append("Password must be at least 8 characters")
        if postData["password"] != postData["confirm_password"]:
            errors.append("Password and Confirm Password must match")
        if self.filter(email = postData["email"]):
            errors.append("This email has already been registered.")

        if not errors:
            pw_hash = bcrypt.hashpw(postData["password"].encode(), bcrypt.gensalt())
            user = self.create(first_name=postData["first_name"], last_name=postData["last_name"], email=postData["email"], pw_hash = pw_hash)
            return (True, user)
        else:
            return (False, errors)

    def login(self, postData):
        try:
            user = Users.objects.get(email = postData["email"])
            if not bcrypt.checkpw(postData["password"].encode(), user.pw_hash.encode()):
                return (False, "Password incorrect")
        except:
            return (False, "Email is not registered")

        user = Users.objects.get(email=postData["email"])
        return (True, user)


class Users(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    pw_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()
