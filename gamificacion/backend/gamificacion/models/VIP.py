from django.db import models
from .users import Tbl_users

class tbl_VIP(models.Model):
    Id = models.AutoField(primary_key=True)  # ← Corregido
    Id_Users = models.ForeignKey(Tbl_users, on_delete=models.CASCADE, related_name='vips')
    Name = models.CharField(max_length=100)
    # ← Eliminado duplicado Id_Users
    
    class Meta:
        db_table = 'tbl_vip'
        verbose_name = 'VIP'
        verbose_name_plural = 'VIPs'
    
    def __str__(self):
        return self.Name