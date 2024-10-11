from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileView
from .views import (
    AnswersViewSet, CoursesViewSet, QuestionsViewSet, ReadtopicsViewSet, 
    TestresultsViewSet, TestsViewSet, TopicsViewSet, UserescoursesrelViewSet, UsersViewSet, setCSRFCookie
)

router = DefaultRouter()
router.register(r'answers', AnswersViewSet)
router.register(r'courses', CoursesViewSet)
router.register(r'questions', QuestionsViewSet)
router.register(r'readtopics', ReadtopicsViewSet)
router.register(r'testresults', TestresultsViewSet)
router.register(r'tests', TestsViewSet)
router.register(r'topics', TopicsViewSet)
router.register(r'userescoursesrel', UserescoursesrelViewSet)
router.register(r'users', UsersViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('setcsrf/', setCSRFCookie.get),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
]
