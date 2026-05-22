import jwt
from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Card, Task, User
from .serializers import TaskSerializer


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


class TaskCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_authenticated_user(request)
        task_title = request.data.get('task_title')
        task_description = request.data.get('task_description')
        task_file_url = request.data.get('task_file_url')
        status_value = request.data.get('status')

        task = Task.objects.create(
            user=user,
            card=None,
            task_title=task_title,
            task_description=task_description,
            task_file_url=task_file_url,
            status=status_value,
        )
        return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)


class TaskUpdateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, task_id):
        user = get_authenticated_user(request)
        task = Task.objects.filter(id=task_id, user=user).first()
        if not task:
            return Response({'message': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        card_id = request.data.get('card_id')
        if card_id in ('', 'null'):
            card_id = None

        if card_id is not None:
            card = Card.objects.filter(id=card_id, user=user).first()
            if not card:
                return Response({'message': 'Card not found.'}, status=status.HTTP_404_NOT_FOUND)
            task.card = card

        if 'task_title' in request.data:
            task.task_title = request.data.get('task_title')
        if 'task_description' in request.data:
            task.task_description = request.data.get('task_description')
        if 'task_file_url' in request.data:
            task.task_file_url = request.data.get('task_file_url')
        if 'status' in request.data:
            task.status = request.data.get('status')

        task.save()
        return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)


class TaskDeleteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, task_id):
        user = get_authenticated_user(request)
        task = Task.objects.filter(id=task_id, user=user).first()
        if not task:
            return Response({'message': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        task.card = None
        task.save()
        return Response({'message': 'Task detached from card successfully.'}, status=status.HTTP_200_OK)


class TaskHardDeleteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, task_id):
        user = get_authenticated_user(request)
        task = Task.objects.filter(id=task_id, user=user).first()
        if not task:
            return Response({'message': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response({'message': 'Task deleted successfully.'}, status=status.HTTP_200_OK)


class TaskGetView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_authenticated_user(request)
        tasks = Task.objects.filter(user=user, card__isnull=True).order_by('-created_at')
        return Response(TaskSerializer(tasks, many=True).data, status=status.HTTP_200_OK)


class AllTaskGetView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_authenticated_user(request)
        tasks = Task.objects.filter(user=user).order_by('-created_at')
        return Response(TaskSerializer(tasks, many=True).data, status=status.HTTP_200_OK)