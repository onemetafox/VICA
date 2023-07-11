import os

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from users.managers import UserManager

from .utils import validate_phone_number


def photo_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return os.path.join("profile-images", f"{instance.pk}-photo.{ext}")

class User(AbstractUser):
    first_name = models.CharField(_("first name"), max_length=150, blank=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True)
    email = models.EmailField(_("email address"), unique=True)
    phone_number = models.CharField(
        max_length=15,
        validators=[validate_phone_number,],
    )
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    photo = models.ImageField(blank=True, null=True, upload_to=photo_upload_path)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def has_active_arbitrage_account(self):
        return hasattr(self, 'arbitrage_subscription')

    def save(self, *args, **kwargs):
        return super(User, self).save(*args, **kwargs)
