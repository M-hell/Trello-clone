import jwt
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Card, Task, User
from .serializers import CardSerializer


def get_authenticated_user(request):
    token = request.COOKIES.get('jwt')
    if not token:
        raise AuthenticationFailed('Unauthenticated.')

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationFailed('Token expired.') from exc
    except jwt.InvalidTokenError as exc:
        raise AuthenticationFailed('Invalid token.') from exc

    user = User.objects.filter(id=payload.get('user_id')).first()
    if not user:
        raise AuthenticationFailed('User not found.')
    return user


def make_unique_label(base_label, existing_labels, fallback_id=None):
    if not base_label:
        return base_label

    if base_label not in existing_labels:
        return base_label

    if fallback_id is not None:
        fallback_candidate = f'{base_label} {fallback_id}'
        if fallback_candidate not in existing_labels:
            return fallback_candidate

    suffix = 1
    while True:
        candidate = f'{base_label} {suffix}'
        if candidate not in existing_labels:
            return candidate
        suffix += 1


class CardCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_authenticated_user(request)
        card_name = request.data.get('card_name')
        due_date = request.data.get('due_date')
        tags = request.data.get('tags')
        if not card_name:
            return Response(
                {'message': 'card_name is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        card = Card.objects.create(
            user=user,
            card_name=card_name,
            due_date=due_date,
            tags=tags,
        )
        return Response(CardSerializer(card).data, status=status.HTTP_201_CREATED)


class CardCopyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_authenticated_user(request)
        card_id = request.data.get('card_id')
        transfer_user_id = request.data.get('transferuserid')

        if not card_id or not transfer_user_id:
            return Response(
                {'message': 'card_id and transferuserid are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        original_card = Card.objects.filter(id=card_id, user=user).prefetch_related('tasks').first()
        if not original_card:
            return Response({'message': 'Card not found.'}, status=status.HTTP_404_NOT_FOUND)

        target_user = User.objects.filter(id=transfer_user_id).first()
        if not target_user:
            return Response({'message': 'Transfer user not found.'}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            target_card_names = set(
                Card.objects.filter(user=target_user).values_list('card_name', flat=True)
            )
            copied_card_name = make_unique_label(
                original_card.card_name,
                target_card_names,
                fallback_id=original_card.id,
            )

            copied_card = Card.objects.create(
                user=target_user,
                card_name=copied_card_name,
                due_date=original_card.due_date,
                tags=original_card.tags,
            )

            used_task_titles = set(
                Task.objects.filter(user=target_user).values_list('task_title', flat=True)
            )

            for task in original_card.tasks.all():
                copied_task_title = make_unique_label(
                    task.task_title,
                    used_task_titles,
                    fallback_id=task.id,
                )
                used_task_titles.add(copied_task_title)

                Task.objects.create(
                    user=target_user,
                    card=copied_card,
                    task_title=copied_task_title,
                    task_description=task.task_description,
                    task_file_url=task.task_file_url,
                    status=task.status,
                )

        return Response(
            {
                'message': 'Card copied successfully.',
                'card': CardSerializer(copied_card).data,
            },
            status=status.HTTP_201_CREATED,
        )

class CardGetView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_authenticated_user(request)
        cards = Card.objects.filter(user=user).prefetch_related('tasks').order_by('-created_at')
        return Response(CardSerializer(cards, many=True).data, status=status.HTTP_200_OK)


class CardDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, card_id):
        user = get_authenticated_user(request)
        card = Card.objects.filter(id=card_id, user=user).first()
        if not card:
            return Response({'message': 'Card not found.'}, status=status.HTTP_404_NOT_FOUND)

        card.delete()
        return Response({'message': 'Card deleted successfully.'}, status=status.HTTP_200_OK)

    def post(self, request, card_id):
        return self.delete(request, card_id)


class CardUpdateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, card_id):
        user = get_authenticated_user(request)
        card = Card.objects.filter(id=card_id, user=user).first()
        if not card:
            return Response({'message': 'Card not found.'}, status=status.HTTP_404_NOT_FOUND)

        card_name = request.data.get('card_name')
        if not card_name:
            return Response(
                {'message': 'card_name is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        card.card_name = card_name
        if 'due_date' in request.data:
            card.due_date = request.data.get('due_date')
        if 'tags' in request.data:
            card.tags = request.data.get('tags')
        card.save()
        return Response(CardSerializer(card).data, status=status.HTTP_200_OK)