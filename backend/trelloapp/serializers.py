from rest_framework import serializers

from .models import Card, Task, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'created_at', 'updated_at')


class TaskSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    card_id = serializers.IntegerField(source='card.id', read_only=True, allow_null=True)

    class Meta:
        model = Task
        fields = (
            'id',
            'user_id',
            'card_id',
            'task_title',
            'task_description',
            'task_file_url',
            'status',
            'created_at',
            'updated_at',
        )


class CardSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ('id', 'user_id', 'card_name', 'due_date', 'tags', 'created_at', 'updated_at', 'tasks')