from django.db import models


class Tbl_users(models.Model):
    Id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, default='')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    level = models.CharField(max_length=5000, blank=True, default='1')
    xp = models.IntegerField(default=0)
    Update_at = models.DateTimeField(auto_now=True)
    xp = models.IntegerField(default=0)
    categoria_activa = models.IntegerField(default=1)

    class Meta:
        db_table = 'tbl_users'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.name