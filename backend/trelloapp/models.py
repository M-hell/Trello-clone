from django.db import models


class User(models.Model):
	name = models.CharField(max_length=255)
	email = models.EmailField(unique=True)
	password = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name


class Card(models.Model):
	user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='cards')
	card_name = models.CharField(max_length=255)
	due_date = models.CharField(max_length=255, null=True, blank=True)
	tags = models.CharField(max_length=255, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.card_name


class Task(models.Model):
	user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
	card = models.ForeignKey('Card', on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
	task_title = models.CharField(max_length=255, blank=True, null=True)
	task_description = models.TextField(blank=True, null=True)
	task_file_url = models.URLField(blank=True, null=True)
	status = models.CharField(max_length=255, blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.task_title or 'Task'
