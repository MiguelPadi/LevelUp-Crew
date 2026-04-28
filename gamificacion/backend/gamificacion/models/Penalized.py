from django.db import models
from .users import Tbl_users
class Tbl_Penalized(models.Model):
    Id = models.AutoField(primary_key=True)
    Id_Users = models.ForeignKey(Tbl_users, on_delete=models.CASCADE, related_name='penalizaciones')
    Level = models.CharField(max_length=5000)
    Update_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tbl_penalized'
        verbose_name = 'Penalizado'
        verbose_name_plural = 'Penalizados'
    
    def __str__(self):
        return f"Penalización de {self.Id_Users.name}"
