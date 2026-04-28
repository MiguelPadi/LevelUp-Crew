
from django.db import models

class Tbl_activity_detail(models.Model):
    Id = models.AutoField(primary_key=True)  # ← Corregido
    Name = models.CharField(max_length=100)
    Create_at = models.DateTimeField(auto_now_add=True)
    Finish_Date = models.DateTimeField(null=True, blank=True)  # ← Cambiado: auto_now no tiene sentido aquí
    
    class Meta:
        db_table = 'tbl_activity_detail'
        verbose_name = 'Detalle de Actividad'
        verbose_name_plural = 'Detalles de Actividades'
    
    def __str__(self):
        return self.Name
