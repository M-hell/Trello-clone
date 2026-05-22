from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer
from .card_views import get_authenticated_user


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        if not name or not email or not password:
            return Response(
                {'message': 'name, email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'message': 'Email already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create(
            name=name,
            email=email,
            password=make_password(password),
        )
        return Response(
            {
                'message': 'User registered successfully.',
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'message': 'email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email=email).first()
        if not user or not check_password(password, user.password):
            return Response(
                {'message': 'Invalid credentials.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        expires_at = datetime.now(timezone.utc) + timedelta(days=2)
        token = jwt.encode(
            {
                'user_id': user.id,
                'exp': expires_at,
                'iat': datetime.now(timezone.utc),
            },
            settings.SECRET_KEY,
            algorithm='HS256',
        )

        response = Response(
            {
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
        response.set_cookie(
            key='jwt',
            value=token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=2 * 24 * 60 * 60,
        )
        return response


class AllUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        current_user = get_authenticated_user(request)

        users = User.objects.all().order_by('name')
        users = users.exclude(id=current_user.id)

        return Response(
            {
                'message': 'Users fetched successfully.',
                'users': UserSerializer(users, many=True).data,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({'message': 'Logout successful.'}, status=status.HTTP_200_OK)

        # Expire the single jwt cookie (match attributes used when setting it)
        response.set_cookie(
            key='jwt',
            value='',
            max_age=0,
            expires='Thu, 01 Jan 1970 00:00:00 GMT',
            path='/',
            httponly=True,
            secure=False,
            samesite='Lax',
        )

        return response