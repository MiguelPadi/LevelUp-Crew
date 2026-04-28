from rest_framework import serializers
from ..models.VIP import tbl_VIP

class VIPSerializer(serializers.ModelSerializer):
    class Meta:
        model = tbl_VIP
        fields = '__all__'