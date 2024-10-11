import time

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import DjangoModelPermissions
from .models import Answers, Courses, Questions, Readtopics, Testresults, Tests, Topics, Userescoursesrel
from .serializers import (
    AnswersSerializer, CoursesSerializer, QuestionsSerializer, ReadtopicsSerializer, 
    TestresultsSerializer, TestsSerializer, TopicsSerializer, UserescoursesrelSerializer, UsersSerializer
)
# views.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import User as Users

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.decorators import permission_required
from secrets import token_bytes


from django.utils.decorators import method_decorator
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
ensure_csrf = method_decorator(ensure_csrf_cookie)


class setCSRFCookie(APIView):
    permission_classes = []
    authentication_classes = []
    @ensure_csrf
    def get(self, request):
        return Response("CSRF Cookie set.")

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            # Попробуем найти пользователя по логину и паролю
            user = authenticate(username=username, password=password)
            perm = Permission.objects.get(id=58)
            print(perm.name)
            if user is not None:
                login(request, user)
                return JsonResponse({'username': user.username})
            else:
                return JsonResponse({'error': 'Неверный логин или пароль'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Неверный JSON'}, status=400)
    return JsonResponse({'error': 'Неверный method'}, status=400)



# Отвечает за операции создания, чтения, обновления и удаления
class AnswersViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Answers.objects.all()  
    serializer_class = AnswersSerializer  


# Управление курсами через API
class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer


# Включает создание, получение, редактирование и удаление вопросов
class QuestionsViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer


# Преобразует данные о прочитанных темах
class ReadtopicsViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Readtopics.objects.all()
    serializer_class = ReadtopicsSerializer


# Управляет результатами тестов
class TestresultsViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Testresults.objects.all()
    serializer_class = TestresultsSerializer


# Управляет тестами
class TestsViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Tests.objects.all()
    serializer_class = TestsSerializer


# Управляет темами курса



class TopicsViewSet(viewsets.ModelViewSet):
    queryset = Topics.objects.all()
    permission_classes = [DjangoModelPermissions]
    serializer_class = TopicsSerializer

    def list(self, request, *args, **kwargs):
        return super(TopicsViewSet, self).list(self, request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.queryset
        course_id = self.request.query_params.get('course', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset


# Представление для связи пользователей с курсами
class UserescoursesrelViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Userescoursesrel.objects.all()
    serializer_class = UserescoursesrelSerializer


# Управление пользователями через API
class UsersViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

    def create(self, request):
        user = Users.objects.create_user(
            request.data['username'],
            request.data['email'],
            request.data['password'])

        user.first_name = request.data['first_name']
        user.last_name = request.data['last_name']
        user.save()
        st_group = Group.objects.get(name='Student')
        user.groups.add(st_group)
        return Response(UsersSerializer(user).data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]


