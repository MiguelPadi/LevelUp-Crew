from rest_framework import serializers
from ..models.Penalized import Tbl_Penalized

class PenalizedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tbl_Penalized
        fields = '__all__'