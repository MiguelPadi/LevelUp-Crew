

from django.db import models
from .users import Tbl_users
from .activities import tbl_activities

class Tbl_accomplishments_history(models.Model):
    Id = models.AutoField(primary_key=True)  # ← Corregido
    Id_Users = models.ForeignKey(Tbl_users, on_delete=models.CASCADE, related_name='logros')
    Id_activity = models.ForeignKey(tbl_activities, on_delete=models.CASCADE, related_name='logros')
    Create_at = models.DateTimeField(auto_now_add=True)
    Update_at = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'tbl_accomplishments_history'
        verbose_name = 'Historial de Logros'
        verbose_name_plural = 'Historial de Logros'
    
    def __str__(self):
        return f"Logro de {self.Id_Users.name} - {self.Id_activity.Name}"