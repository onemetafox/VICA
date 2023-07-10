from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework import serializers
from rest_framework import viewsets, mixins, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import OfferSerializer, OrderChatSerializer, OrderSerializer, UserPaymentMethodSerializer, ReviewSerializer, PaymentMethodSerializer, DisputeSerializer
from ..models import Offer, Order, OrderChat, PaymentMethod, Review, UserPaymentMethod, Dispute
from .permissions import IsVerifiedOrReadOnly


class OfferCreateListRetrieveViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsVerifiedOrReadOnly]

    def get_queryset(self):
        return Offer.objects.filter(status=Offer.Status.ACTIVE)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return response

    @action(methods=["OPTIONS", "GET"], url_path='related-orders', detail=True)
    def related_orders(self, request, pk=None):
        order_no = self.request.GET.get("order_no", None)
        if order_no:
            order = get_object_or_404(Order, offer__pk=pk, order_no=order_no)
            serializer = OrderSerializer(order, context={"request": request})
        else:
            orders = Order.objects.filter(offer__pk=pk)
            serializer = OrderSerializer(
                orders, context={"request": request}, many=True
            )
        return Response(serializer.data)
    
    @action(methods=["OPTIONS", "GET"], url_path='my-offers', detail=False)
    def my_offers(self, request):
        offers = Offer.objects.filter(user=request.user)
        serializer = OfferSerializer(
            offers, context={"request": request}, many=True
        )
        return Response(serializer.data)

    @action(methods=["OPTIONS", "DELETE"], url_path='cancel', detail=True)
    def cancel_offer(self, request, pk=None):
        offer = get_object_or_404(Offer, pk=pk, user=request.user)
        pending_orders = offer.orders.filter(status=Order.Status.PENDING)

        if pending_orders.exists():
            raise serializers.ValidationError("You can't cancel offers with pending orders")

        offer.status = Offer.Status.CANCELLED
        offer.save()

        return Response({"cancelled": True})

    

class OrderCreateListRetrieveViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsVerifiedOrReadOnly]
    lookup_field = 'order_no'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return response
    
    @action(methods=["OPTIONS", "PUT"], url_path='owner-confirm', detail=True)
    def owner_confirm(self, request, order_no=None):
        order = get_object_or_404(Order, offer__user=request.user, order_no=order_no)

        if order.status != Order.Status.PENDING:
            raise serializers.ValidationError("Invalid request!")

        if order.confirmed_by_owner:
            raise serializers.ValidationError("Order already confirmed")

        if order.offer.type == Offer.Type.SELL and (not order.confirmed_by_user):
            raise serializers.ValidationError("The User should confirm first!")

        order.confirmed_by_owner = True
        order.save()

        return Response({"ownerConfirmed": True})

    @action(methods=["OPTIONS", "PUT"], url_path='user-confirm', detail=True)
    def user_confirm(self, request, order_no=None):
        order = get_object_or_404(self.get_queryset(), order_no=order_no)

        if order.status != Order.Status.PENDING:
            raise serializers.ValidationError("Invalid request!")

        if order.confirmed_by_user:
            raise serializers.ValidationError("Order already confirmed")

        if order.offer.type == Offer.Type.BUY and (not order.confirmed_by_owner):
            raise serializers.ValidationError("The Owner should confirm first!")

        order.confirmed_by_user = True
        order.save()

        return Response({"userConfirmed": True})


class PaymentMethodListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response


class UserPaymentMethodCreateListViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = UserPaymentMethod.objects.all()
    serializer_class = UserPaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserPaymentMethod.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response



class ReviewCreateAPIView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        order_no = self.kwargs.get('order_no')
        order = get_object_or_404(Order, order_no=order_no, user=self.request.user)
        if hasattr(order, 'review'):
            raise serializers.ValidationError("Order already reviewed")

        serializer.save(order=order)


class OrderChatCreateAPIView(generics.CreateAPIView):
    queryset = OrderChat.objects.all()
    serializer_class = OrderChatSerializer
    permission_classes = [permissions.IsAuthenticated]


    def perform_create(self, serializer):
        order_no = self.kwargs.get('order_no')
        user = self.request.user
        qs = Order.objects.filter(Q(offer__user=user) | Q(user=user), order_no=order_no)
        if not qs.exists():
            raise serializers.ValidationError("Bad request")
        serializer.save(order=qs.last())


class DisputeCreateAPIView(generics.CreateAPIView):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]


    def perform_create(self, serializer):
        order_no = self.kwargs.get('order_no')
        user = self.request.user
        qs = Order.objects.filter(Q(offer__user=user) | Q(user=user), order_no=order_no)
        if not qs.exists():
            raise serializers.ValidationError("Bad request")
        order = qs.first()
        if not order.status in [Order.Status.PENDING, Order.Status.CANCELLED, Order.Status.EXPIRED,]:
            raise serializers.ValidationError("You can't open dispute on completed orders")

        serializer.save(order=qs.last())
