from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Answers, Courses, Questions, Readtopics, Testresults, Tests, Topics, Userescoursesrel
from .models import User as Users


class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = '__all__'


class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'


class QuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = '__all__'


class ReadtopicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Readtopics
        fields = '__all__'


class TestresultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testresults
        fields = '__all__'

class CoursesItemsSerializer(serializers.Serializer):
    items = serializers.ListField(child=CoursesSerializer())

class TestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tests
        fields = '__all__'


class TopicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topics
        fields = '__all__'


class UserescoursesrelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userescoursesrel
        fields = '__all__'


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'],
                            password=clean_data['password'])
        if not user:
            raise ValidationError("User not found")
        return user


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
