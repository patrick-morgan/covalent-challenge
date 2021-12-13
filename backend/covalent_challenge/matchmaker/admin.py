from django.contrib import admin
from .models import Todo, Users

# Register your models here.

class TodoAdmin(admin.ModelAdmin):
  list_display = ('title', 'description', 'completed')

class UsersAdmin(admin.ModelAdmin):
  list_display = ('name', 'email', 'years')

admin.site.register(Users, UsersAdmin)