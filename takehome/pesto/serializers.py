from rest_framework import serializers
from .models import Task
from rest_framework.serializers import ValidationError


class TaskSerializers(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def validate(self, data):
        if self.context.get("request").method == "POST":
            if data.get("title", "") == "":
                raise ValidationError("Title is missing.")
            if data.get("description", "") == "":
                raise ValidationError("Description is missing.")
            if data.get("priority", "") == "":
                raise ValidationError("Priority is missing.")
            if data.get("due_date", "") == "":
                raise ValidationError("Due date is missing.")
        if data.get("status", "") == "":
            raise ValidationError("Status is missing.")
        return data
