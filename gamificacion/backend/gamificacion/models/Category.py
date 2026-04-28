from django.db import models
from .users import Tbl_users

class Tbl_Category(models.Model):
    Id = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=100)

    class Meta:
        db_table = 'tbl_category'
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.Name
