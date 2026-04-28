import random
from gamificacion.models import tbl_activities, Tbl_accomplishments_history
from gamificacion.api.apis import API

class ConfiguracionIA:
    
    def traer_desafio(self, user):
        actividades = tbl_activities.objects.filter(
            Id_Category__Id_Users=user
        ).distinct()

        if not actividades.exists():
            return "No hay actividades registradas para este usuario"

        actividad = actividades.order_by('?').first()

        # Generar desafío con IA
        api = API()
        desafio = api.generar_desafio(
            f"{actividad.Name}: {actividad.Id_activity_detail.Name}"
        )

        return desafio