from rest_framework import serializers
from ..models.Category import Tbl_Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tbl_Category
        fields = '__all__'