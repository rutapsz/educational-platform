from rest_framework import serializers
from .models import Course, Teacher, Student, ClassGroup, Schedule, Grade, LearningHistory, Material, Certificate

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

# Добавьте сериализаторы для других моделей аналогично
