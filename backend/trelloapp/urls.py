from django.urls import path

from .auth_views import AllUsersView, LoginView, LogoutView, RegisterView
from .card_views import CardCopyView, CardCreateView, CardDeleteView, CardGetView, CardUpdateView
from .task_views import AllTaskGetView, TaskCreateView, TaskDeleteView, TaskGetView, TaskUpdateView, TaskHardDeleteView

urlpatterns = [
    # Authentication endpoints
	path('auth/register/', RegisterView.as_view(), name='register'),
	path('auth/login/', LoginView.as_view(), name='login'),
	path('auth/logout/', LogoutView.as_view(), name='logout'),
	path('auth/users/', AllUsersView.as_view(), name='all-users'),

    # Card endpoints
	path('cards/create/', CardCreateView.as_view(), name='card-create'),
	path('cards/copy/', CardCopyView.as_view(), name='card-copy'),
	path('cards/', CardGetView.as_view(), name='card-get'),
	path('cards/<int:card_id>/update/', CardUpdateView.as_view(), name='card-update'),
	path('cards/<int:card_id>/delete/', CardDeleteView.as_view(), name='card-delete'),

	# Task endpoints
	path('tasks/create/', TaskCreateView.as_view(), name='task-create'),
	path('tasks/', TaskGetView.as_view(), name='task-get'),
	path('all-tasks/', AllTaskGetView.as_view(), name='all-task-get'),
	path('tasks/<int:task_id>/update/', TaskUpdateView.as_view(), name='task-update'),
	path('tasks/<int:task_id>/delete/', TaskDeleteView.as_view(), name='task-delete'),
	path('tasks/<int:task_id>/hard-delete/', TaskHardDeleteView.as_view(), name='task-hard-delete'),
]