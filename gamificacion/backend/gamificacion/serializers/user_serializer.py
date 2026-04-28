from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from ..models.users import Tbl_users


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, default='')
    level = serializers.CharField(required=False, default='1')

    class Meta:
        model = Tbl_users
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)