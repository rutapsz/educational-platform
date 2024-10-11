from django.db import models


class Answers(models.Model):
    id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey('questions', models.DO_NOTHING, blank=True, null=True)
    answer = models.CharField(blank=True, null=True)
    is_correct = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = 'answers'


class Courses(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField()
    main_info = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'courses'


class Questions(models.Model):
    id = models.BigAutoField(primary_key=True)
    test = models.ForeignKey('tests', models.DO_NOTHING, blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)
    question = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'questions'


class Readtopics(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('users', models.DO_NOTHING, blank=True, null=True)
    topic = models.ForeignKey('topics', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'readtopics'


class Testresults(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('users', models.DO_NOTHING, blank=True, null=True)
    test = models.ForeignKey('tests', models.DO_NOTHING, blank=True, null=True)
    total_score = models.IntegerField(blank=True, null=True)
    try_numb = models.SmallIntegerField(blank=True, null=True)
    test_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'testresults'


class Tests(models.Model):
    id = models.BigAutoField(primary_key=True)
    course = models.ForeignKey(Courses, models.DO_NOTHING, blank=True, null=True)
    module = models.IntegerField(blank=True, null=True)
    name = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'tests'


class Topics(models.Model):
    id = models.BigAutoField(primary_key=True)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE, blank=True, null=True)
    module = models.IntegerField(blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)
    data_ref = models.CharField(blank=True, null=True)
    name = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'topics'


class Userescoursesrel(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('users', models.DO_NOTHING, blank=True, null=True)
    course = models.ForeignKey(Courses, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'userescoursesRel'


class Users(models.Model):
    id = models.BigAutoField(primary_key=True)
    login = models.CharField(unique=True, max_length=32)
    password = models.CharField()
    email = models.CharField(unique=True, blank=True, null=True)
    role = models.CharField(blank=True, null=True)
    token = models.CharField(blank=True, null=True)
    seance = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'users'
