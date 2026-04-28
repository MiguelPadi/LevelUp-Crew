from django.db import models
from .Category import Tbl_Category
from .activity_detail import Tbl_activity_detail


class tbl_activities(models.Model):
    Id = models.AutoField(primary_key=True)
    Id_Category = models.ForeignKey(Tbl_Category, on_delete=models.CASCADE, related_name='actividades')
    Name = models.CharField(max_length=100)
    xp = models.IntegerField(default=10)
    Id_activity_detail = models.ForeignKey(Tbl_activity_detail, on_delete=models.CASCADE, related_name='actividades')
    Create_at = models.DateTimeField(auto_now_add=True)
    Finish_Date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'tbl_activities'
        verbose_name = 'Actividad'
        verbose_name_plural = 'Actividades'

    def __str__(self):
        return self.Name