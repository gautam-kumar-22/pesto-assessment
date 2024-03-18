from django.test import TestCase, Client
from .models import Task


class TaskTestCase(TestCase):
    def setUp(self):
        self.client = Client()  # Initialize the Django test client
        # Create some initial data for testing
        self.task1 = Task.objects.create(title='Task1', description="test description")
        self.task2 = Task.objects.create(title='Task1', description="test description")

    def test_create_Task_fail(self):
        # Test creating a new Task with fail, not passing required data
        response = self.client.post('/task/', {'title': 'New Task', 'description': "New task description"})
        self.assertEqual(response.status_code, 400)  # Check if the request was fail

    def test_create_Task_pass(self):
        # Test creating a new Task
        response = self.client.post('/task/', {'title': 'New Task', 'description': "New task description",
                                               "due_date": "2024-11-30", "status": "to-do", "priority": "low"})
        self.assertEqual(response.status_code, 201)  # Check if the request was successful
        self.assertEqual(Task.objects.count(), 3)  # Check if the count increased

    def test_read_Task(self):
        # Test reading a Task
        response = self.client.get(f'/task/{self.task1.id}/')
        self.assertEqual(response.status_code, 200)  # Check if the request was successful
        task_data = response.json()
        self.assertEqual(task_data['title'], 'Task1')
        self.assertEqual(task_data['description'], "test description")

    def test_update_Task_patch(self):
        # Test updating a Task
        response = self.client.patch(f'/task/{self.task1.id}/', {"status": "done"},
                                     content_type="application/json")
        self.assertEqual(response.status_code, 200)  # Check if the request was successful
        updated_task = Task.objects.get(id=self.task1.id)
        self.assertEqual(updated_task.status, "done")

    def test_update_Task_update(self):
        # Test updating a Task
        response = self.client.put(f'/task/{self.task1.id}/', {'title': 'New Task update',
                    'description': "New task description", "due_date": "2024-11-30", "status": "to-do",
                    "priority": "low"}, content_type="application/json")
        self.assertEqual(response.status_code, 200)  # Check if the request was successful
        updated_task = Task.objects.get(id=self.task1.id)
        self.assertEqual(updated_task.title, "New Task update")

    def test_delete_Task(self):
        # Test deleting a Task
        response = self.client.delete(f'/task/{self.task1.id}/')
        self.assertEqual(response.status_code, 204)  # Check if the request was successful
        self.assertEqual(Task.objects.count(), 1)
