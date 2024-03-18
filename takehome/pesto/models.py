from django.db import models
from django.utils import timezone


class Task(models.Model):
    """
    Task models to store user's task.
    @Fields:
        title<CharField>: Store title
        description<CharField>: Store description
        status<CharField>: Store status of task (todo, in-progress, done)
        priority<CharField>: Store priority of task (low, medium, high)
        due_date<DateField>: Store due date of task
    """
    STATUS_CHOICES = (
        ("to-do", "TO-DO"),
        ("in-progress", "In-progress"),
        ("done", "Done")
    )
    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High")
    )
    title = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    status = models.CharField(choices=STATUS_CHOICES, null=False, blank=False, default="to-do", max_length=20)
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(choices=PRIORITY_CHOICES, null=False, blank=False, default="low", max_length=10)
    is_complete = models.BooleanField(default=False)
    creation_date = models.DateTimeField(default=timezone.now)
