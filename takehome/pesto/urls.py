from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
from .views import TaskViewSet

router.register("task", TaskViewSet, basename="task")

urlpatterns = [
    path('', include(router.urls)),
]
