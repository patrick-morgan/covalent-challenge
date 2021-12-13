"""covalent_challenge URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from matchmaker import views

router = routers.DefaultRouter()
router.register(r'todos', views.TodoView, 'todo')
router.register(r'users', views.UsersView, 'user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('matches/', views.MatchesList.as_view()),
    path('users', views.UsersList.as_view()),
    path('delete/<int:pk>/', views.MatchDelete.as_view(), name='delete-match'),
    path('create/', views.MatchCreate.as_view(), name='create-match'),
    path('generate-matches/', views.generateMatches),
    path('needs-matching/', views.usersNeedMatch.as_view(), name='needs-matching'),
]
