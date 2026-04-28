from rest_framework import serializers
from ..models.accomplishments_history import Tbl_accomplishments_history

class AccomplishmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tbl_accomplishments_history
        fields = '__all__'