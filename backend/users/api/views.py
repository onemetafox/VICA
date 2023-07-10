from allauth.account.views import ConfirmEmailView
from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import AllowAny
from django.http import HttpResponseRedirect
from rest_framework.views import APIView

from dj_rest_auth.registration.serializers import VerifyEmailSerializer

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
        return HttpResponseRedirect(redirect_to='https://crypto-wallet-web.vercel.app/emailverified')
