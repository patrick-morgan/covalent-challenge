from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models.fields import related

# Create your models here.
class Todo(models.Model):
  title = models.CharField(max_length=120)
  description = models.TextField()
  completed = models.BooleanField(default=False)

  def _str_(self):
    return self.title



class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    years = models.SmallIntegerField()
    interests = ArrayField(models.TextField())

    class Meta:
        managed = False
        db_table = 'users'

class Matches(models.Model):
    match_id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(Users, on_delete=models.DO_NOTHING, to_field='user_id', related_name='+')
    user2 = models.ForeignKey(Users, on_delete=models.DO_NOTHING, to_field='user_id', related_name='+')

    # myname = models.CharField(max_length=255)
    # user2 = models.ForeignKey(Users, on_delete=models.DO_NOTHING, to_field='user_id', related_name='+')

    # user = models.ForeignKey('Users', on_delete=models.DO_NOTHING)
    # user2 = models.ForeignKey('Users', on_delete=models.DO_NOTHING, related_name='+')

    class Meta:
        managed = False
        db_table = 'matches'