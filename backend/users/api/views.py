from django.http import HttpResponseRedirect
from django.conf import settings
from allauth.account.views import ConfirmEmailView
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from dj_rest_auth.registration.serializers import VerifyEmailSerializer
from dj_rest_auth.views import PasswordResetConfirmView

class VerifyEmailView(APIView, ConfirmEmailView):
    permission_classes = (AllowAny,)
    allowed_methods = ('GET', 'OPTIONS', 'HEAD')

    def get_serializer(self, *args, **kwargs):
        return VerifyEmailSerializer(*args, **kwargs)

    def post(self, *args, **kwargs):
        raise MethodNotAllowed('POST')

    def get(self, request, key, *args, **kwargs):
        request.data.update({"key": key})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.kwargs['key'] = serializer.validated_data['key']
        confirmation = self.get_object()
        confirmation.confirm(self.request)
        return HttpResponseRedirect(redirect_to=f'{settings.FRONTEND_DOMAIN}/emailverified')


class CustomPasswordResetConfirmView(PasswordResetConfirmView):

    def get(self, request, uidb64, token, *args, **kwargs):
        return HttpResponseRedirect(redirect_to=f'{settings.FRONTEND_DOMAIN}/password-change/{uidb64}/{token}')