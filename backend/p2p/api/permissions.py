from rest_framework.permissions import BasePermission

SAFE_METHODS = ('GET', 'HEAD', 'OPTIONS')

class IsVerifiedOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated and not request.user.emailaddress_set.last().verified:
            self.message = "Please verify you email to perform this action"
            
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated and
            request.user.emailaddress_set.last().verified
        )
    
