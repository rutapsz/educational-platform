from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileView, UserLogin, UserLogout, UserRegistration
from .views import (
    AnswersViewSet, CoursesViewSet, QuestionsViewSet, ReadtopicsViewSet, 
    TestresultsViewSet, TestsViewSet, TopicsViewSet, UserescoursesrelViewSet, UsersViewSet
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
router.register(r'user', UsersViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    path('login_user/', UserLogin.as_view(), name='login'),
    path('logout_user/', UserLogout.as_view(), name='logout'),
    path('registration/', UserRegistration.as_view(), name='registration')
]

