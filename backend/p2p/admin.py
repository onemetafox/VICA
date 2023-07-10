from django.contrib import admin

from .models import PaymentMethod, Offer, Order, UserPaymentMethod, Review, Dispute

class DisputeAdmin(admin.ModelAdmin):
            
    list_display = (
        'id',
        'order',
        'user',
        'user_name',
        'created_at',
        'is_resolved',
    )

admin.site.register(PaymentMethod)
admin.site.register(UserPaymentMethod)
admin.site.register(Offer)
admin.site.register(Order)
admin.site.register(Review)
admin.site.register(Dispute, DisputeAdmin)