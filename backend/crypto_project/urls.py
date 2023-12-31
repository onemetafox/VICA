"""crypto_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static


from users.api.views import VerifyEmailView, CustomPasswordResetConfirmView

admin.site.site_title = 'VICA ADMIN'
admin.site.site_header = 'VICA ADMIN'
admin.site.index_title = 'VICA ADMIN'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('rest-auth/', include('dj_rest_auth.urls')),
    re_path(
        "rest-auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$", VerifyEmailView.as_view(),
        name='account_confirm_email'
    ),
    path('rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('rest-auth/password/reset/confirm/<str:uidb64>/<str:token>', CustomPasswordResetConfirmView.as_view(),
            name='password_reset_confirm'),
    path('wallet/', include('wallet.urls', namespace='wallet')),
    path('p2p/', include('p2p.urls', namespace='p2p')),
    path('arbitrage/', include('arbitrage.urls', namespace='arbitrage')),
    path("", lambda request: HttpResponse("alive!"), name="ping"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)