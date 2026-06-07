from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Gender(models.TextChoices):
        MALE        = 'male',   'Male'
        FEMALE      = 'female', 'Female'
        OTHER       = 'other',  'Other'

    username = None

    email = models.EmailField(unique=True)
    middle_name = models.CharField(max_length=100, blank=True)
    citizenship_number = models.CharField(max_length=50, unique=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    gender = models.CharField(max_length=20, choices=Gender.choices)
    phone_number = models.CharField(max_length=20, blank=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['citizenship_number']

    @property
    def full_name(self):
        parts = [self.first_name, self.middle_name, self.last_name]
        return ' '.join(p for p in parts if p)

    def __str__(self):
        return self.email