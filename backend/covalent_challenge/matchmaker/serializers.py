from rest_framework import serializers
from .models import Todo

# Serializers convert model instances to JSON so that the 
# frontend can work w/ the received data

# Specifies the model to work w/ and the fields to be converted to JSON
class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')