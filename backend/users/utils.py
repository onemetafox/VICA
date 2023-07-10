import phonenumbers
from functools import wraps
from django.core.exceptions import ValidationError
from phonenumbers.phonenumberutil import NumberParseException


def validate_phone_number(phone_number):
    """Verify whether the phone number is valid or not"""
    try:
        phonenumbers.parse(phone_number)
    except NumberParseException:
        raise ValidationError("The phone number is invalid!")


def disable_for_loaddata(signal_handler):
    """
    Decorator that turns off signal handlers when loading fixture data.
    """

    @wraps(signal_handler)
    def wrapper(*args, **kwargs):
        if kwargs.get('raw'):
            return
        signal_handler(*args, **kwargs)
    return wrapper