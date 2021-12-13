from rest_framework import serializers
from .models import Matches, Todo, Users

# Serializers convert model instances to JSON so that the 
# frontend can work w/ the received data

# Specifies the model to work w/ and the fields to be converted to JSON
class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'name', 'email', 'city', 'years', 'interests')

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matches
        fields = ('match_id', 'user1', 'user2')