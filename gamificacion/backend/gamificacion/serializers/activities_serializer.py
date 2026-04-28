from rest_framework import serializers
from ..models.activities import tbl_activities

class ActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = tbl_activities
        fields = '__all__'