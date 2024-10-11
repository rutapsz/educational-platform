from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import Answers, Courses, Questions, Readtopics, Testresults, Tests, Topics, Userescoursesrel, Users
from .serializers import (
    AnswersSerializer, CoursesSerializer, QuestionsSerializer, ReadtopicsSerializer, 
    TestresultsSerializer, TestsSerializer, TopicsSerializer, UserescoursesrelSerializer, UsersSerializer
)


# views.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Users

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView





# логика входа
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            login = data.get('login')
            password = data.get('password')

            # Попробуем найти пользователя по логину и паролю
            user = Users.objects.get(login=login, password=password)
            
            # Генерация токена
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'Успех',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=200)
        except Users.DoesNotExist:
            return JsonResponse({'error': 'Неверный логин или пароль'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Неверный JSON'}, status=400)
    return JsonResponse({'error': 'Неверный method'}, status=400)




# Управление курсами через API
class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer



# Преобразует данные о прочитанных темах
class ReadtopicsViewSet(viewsets.ModelViewSet):
    queryset = Readtopics.objects.all()
    serializer_class = ReadtopicsSerializer


# Управляет результатами тестов
class TestresultsViewSet(viewsets.ModelViewSet):
    queryset = Testresults.objects.all()
    serializer_class = TestresultsSerializer



# Управляет темами курса
class TopicsViewSet(viewsets.ModelViewSet):
    queryset = Topics.objects.all()
    serializer_class = TopicsSerializer

    def get_queryset(self):
        queryset = self.queryset
        course_id = self.request.query_params.get('course', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset


# Представление для связи пользователей с курсами
class UserescoursesrelViewSet(viewsets.ModelViewSet):
    queryset = Userescoursesrel.objects.all()
    serializer_class = UserescoursesrelSerializer


# Управление пользователями через API
class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UsersSerializer(user)
        return Response(serializer.data)
    
class TestsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tests.objects.all()
    serializer_class = TestsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset


class QuestionsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        test_id = self.request.query_params.get('test', None)
        if test_id is not None:
            queryset = queryset.filter(test_id=test_id)
        return queryset


class AnswersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Answers.objects.all()
    serializer_class = AnswersSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        question_id = self.request.query_params.get('question', None)
        if question_id is not None:
            queryset = queryset.filter(question_id=question_id)
        return queryset
    
# Управляет результатами тестов  
class TestResultView(APIView):
    queryset = Testresults.objects.all()
    serializer_class = TestresultsSerializer
    def post(self, request):
        user_id = request.data.get('user')
        test_id = request.data.get('test')
        total_score = request.data.get('total_score')

        user = Users.objects.get(id=user_id)
        test = Tests.objects.get(id=test_id)

        test_result, created = Testresults.objects.get_or_create(user=user, test=test)

        if created:
            test_result.total_score = total_score
            test_result.try_numb = 1
        else:
            if total_score > test_result.total_score:
                test_result.total_score = total_score
            test_result.try_numb += 1

        test_result.test_date = timezone.now()
        test_result.save()

        return Response({'message': 'Результаты сохранены'}, status=status.HTTP_200_OK)