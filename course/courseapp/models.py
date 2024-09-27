from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=255)
    topic = models.CharField(max_length=255)
    session_count = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_students = models.PositiveIntegerField()

    def __str__(self):
        return self.name

class Teacher(models.Model):
    full_name = models.CharField(max_length=255)
    birth_date = models.DateField()
    specialization = models.TextField()
    contact_info = models.TextField()
    is_staff = models.BooleanField(default=True)
    experience = models.PositiveIntegerField()

    def __str__(self):
        return self.full_name

class Student(models.Model):
    full_name = models.CharField(max_length=255)
    birth_date = models.DateField()
    contact_info = models.TextField()

    def __str__(self):
        return self.full_name

class Grade(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    grade = models.CharField(max_length=2)
    date = models.DateField()

    def __str__(self):
        return f'{self.student.full_name} - {self.grade}'

class LearningHistory(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    certificate_id = models.PositiveIntegerField(null=True, blank=True)
    completion_date = models.DateField()

    def __str__(self):
        return f'{self.student.full_name} - {self.course.name}'

class Material(models.Model):
    name = models.CharField(max_length=255)
    material_type = models.CharField(max_length=255)
    condition = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Certificate(models.Model):
    CERTIFICATE_CHOICES = [
        ('certificate', 'Certificate'),
        ('diploma', 'Diploma'),
    ]
    certificate_type = models.CharField(max_length=50, choices=CERTIFICATE_CHOICES)
    issue_date = models.DateField()
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.student.full_name} - {self.certificate_type}'
