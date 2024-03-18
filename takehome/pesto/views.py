from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import TaskSerializers
from .models import Task
from rest_framework.decorators import action


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializers

    @action(detail=False, methods=['get'])
    def filter_status(self, request, *args, **kwargs):
        status = self.request.query_params.get("status", "")
        queryset = self.queryset.filter(status=status)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
