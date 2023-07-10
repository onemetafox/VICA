import uuid

from django.contrib import auth
from django.contrib.auth.models import UserManager as BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """ 
        A custom user manager that uses the email instead of username
    """

    def create_user(self, email, password=None, **extra_fields):
        username = f"{extra_fields.get('first_name', 'name')}-{uuid.uuid4().__str__().split('-')[0]}"
        return super(UserManager, self).create_user(
            username=username,
            email=email,
            password=password,
            **extra_fields,
        )

    def create_superuser(self, email, password=None, **extra_fields):
        username = f"{extra_fields.get('first_name', 'name')}-{uuid.uuid4().__str__().split('-')[0]}"
        return super(UserManager, self).create_superuser(
            username=username,
            email=email,
            password=password,
            **extra_fields,
        )