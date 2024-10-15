import time

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from .models import Answers, Courses, Questions, Readtopics, Testresults, Tests, Topics, Userescoursesrel
from .serializers import (
    AnswersSerializer, CoursesSerializer, QuestionsSerializer, ReadtopicsSerializer,
    TestresultsSerializer, TestsSerializer, TopicsSerializer, UserescoursesrelSerializer, UsersSerializer,
    UserLoginSerializer, CoursesItemsSerializer
)
# views.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from .models import User as Users
from rest_framework.authentication import SessionAuthentication

from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.models import Group, Permission
from django.contrib.auth.decorators import permission_required
from secrets import token_bytes

from django.utils.decorators import method_decorator
from rest_framework.response import Response

from django.db.models import Avg, Count
from reportlab.pdfgen import canvas

class UserLogin(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            user = Users.objects.filter(username=data['username']).first()
            data['staff'] = user.is_staff
            data['username'] = user.id
            return Response(data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        print('isAllowed')
        logout(request)
        return Response(status=status.HTTP_200_OK)


# Отвечает за операции создания, чтения, обновления и удаления
class AnswersViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Answers.objects.all()
    serializer_class = AnswersSerializer

# Управление курсами через API

class ViewCourses(APIView):
    permission_classes =[AllowAny]
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer

    def get(self, request):
        return Response(CoursesItemsSerializer({'items': self.queryset.all()}).data['items'], status=status.HTTP_200_OK)


class CoursesViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
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


class UserRegistration(APIView):

    permission_classes = [AllowAny]
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

    def post(self, request):
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

class AdminReportsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    def user_ratings(self, request):
        report = Testresults.objects.values('user__login').annotate(avg_score=Avg('total_score')).order_by('-avg_score')
        return Response(report)

    def completion_stats(self, request):
        report = Testresults.objects.filter(total_score__gte=80).values('user__login', 'course__name').annotate(
            num_completed=Count('id'))
        return Response(report)

class CertificateViewSet(viewsets.ViewSet):
    # Генерация PDF-сертификата
    def generate_certificate(self, user, course):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="certificate_{user.username}.pdf"'
        p = canvas.Canvas(response)
        p.drawString(100, 750, "Certificate of Completion")
        p.drawString(100, 700, f"Congratulations {user.username}!")
        p.drawString(100, 650, f"You have successfully completed {course.name}.")
        p.showPage()
        p.save()
        return response

    def post(self, request, *args, **kwargs):
        user = request.user
        course = get_object_or_404(Courses, id=kwargs.get('course_id'))

        if Testresults.objects.filter(user=user, course=course, total_score__gte=80).exists():
            pdf = self.generate_certificate(user, course)
            self.send_certificate_via_email(user, course, pdf)
            return Response({'message': 'Certificate sent successfully.'})
        return Response({'error': 'Course not completed with required score.'}, status=400)

    def send_certificate_via_email(self, user, course, pdf_content):
        email = EmailMessage(
            'Your Course Certificate',
            f'Congratulations {user.username}, you have successfully completed {course.name}. Your certificate is attached.',
            'admin@platform.com',
            [user.email],
        )
        email.attach(f'certificate_{user.username}.pdf', pdf_content, 'application/pdf')
        email.send()
