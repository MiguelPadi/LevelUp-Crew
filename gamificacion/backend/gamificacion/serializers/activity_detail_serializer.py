from rest_framework import serializers
from ..models.activity_detail import Tbl_activity_detail

class ActivityDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tbl_activity_detail
        fields = '__all__'