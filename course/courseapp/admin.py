from django.contrib import admin

# Register your models here.
from .models import Course, Teacher, Student, ClassGroup, Schedule, Grade, LearningHistory, Material, Certificate

admin.site.register(Course)
admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(ClassGroup)
admin.site.register(Schedule)
admin.site.register(Grade)
admin.site.register(LearningHistory)
admin.site.register(Material)
admin.site.register(Certificate)