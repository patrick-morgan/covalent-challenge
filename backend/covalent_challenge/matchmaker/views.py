from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, generics
from .serializers import TodoSerializer, UsersSerializer, MatchSerializer
from .models import Matches, Todo, Users
# import Http Response from django
from django.http import HttpResponse
# get datetime
import datetime
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes
import random
from rest_framework.authentication import BasicAuthentication


# Create your views here.

# what is viewsets?
# viewsets base class provides the implementation
# for CRUD operations by default
class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()


class UsersView(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsersSerializer
    queryset = Users.objects.all()


class UsersList(generics.ListAPIView):
    # API to list all matches
    serializer_class = UsersSerializer
    queryset = Users.objects.all()


class MatchesList(generics.ListAPIView):
    # API to list all matches
    serializer_class = MatchSerializer
    queryset = Matches.objects.all()


class usersNeedMatch(generics.ListAPIView):
    serializer_class = UsersSerializer

    # Filter out all users that are already matched
    def get_queryset(self):
        matches = Matches.objects.all()
        user_ids = []

        for match in matches:
            user_ids.append(match.user1.user_id)
            user_ids.append(match.user2.user_id)

        queryset = Users.objects.exclude(user_id__in=Users.objects.filter(
            user_id__in=user_ids).values_list('user_id', flat=True))
        return queryset


@api_view(['PUT'])
def generateMatches(request):
    if request.method == 'PUT':
        # Delete all existing matches
        Matches.objects.all().delete()

        users = Users.objects.all()
        user_ids = []

        # Create array of user_ids in random order
        for user in users:
            user_ids.append(user.user_id)
        user_ids = random.sample(user_ids, len(user_ids))

        # Make matches
        while len(user_ids) >= 2:
            user1 = user_ids.pop()
            user2 = user_ids.pop()

            insertion_data = {
                "user1": user1,
                "user2": user2
            }
            match_serializer = MatchSerializer(data=insertion_data)
            if match_serializer.is_valid():
                match_serializer.save()
        if match_serializer.is_valid():
            return JsonResponse(match_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(match_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MatchCreate(generics.CreateAPIView):
    # API to create a singular match w/ user1 and user2 ids
    serializer_class = MatchSerializer
    queryset = Matches.objects.all()
    authentication_classes = (BasicAuthentication,)


class MatchesDelete(generics.ListAPIView):
    # API to delete all matches
    serializer_class = MatchSerializer
    queryset = Matches.objects.all()


class MatchDelete(generics.RetrieveDestroyAPIView):
    # API to delete a singular match by match_id
    serializer_class = MatchSerializer
    queryset = Matches.objects.all()
    authentication_classes = (BasicAuthentication,)
