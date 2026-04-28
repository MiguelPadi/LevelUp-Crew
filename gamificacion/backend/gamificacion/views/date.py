from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone
import random


from gamificacion.api.resultados import ConfiguracionIA 
from gamificacion.models import (
    Tbl_users,
    tbl_VIP,
    Tbl_Penalized,
    Tbl_Category,
    Tbl_activity_detail,
    tbl_activities,
    Tbl_accomplishments_history
)

from gamificacion.serializers import (
    UserSerializer,
    VIPSerializer,
    PenalizedSerializer,
    CategorySerializer,
    ActivityDetailSerializer,
    ActivitiesSerializer,
    AccomplishmentsSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = Tbl_users.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        if "email" not in request.data:
            return Response({"error": "Email requerido"}, status=400)
        return super().create(request, *args, **kwargs)


class VIPViewSet(viewsets.ModelViewSet):
    queryset = tbl_VIP.objects.all()
    serializer_class = VIPSerializer


class PenalizedViewSet(viewsets.ModelViewSet):
    queryset = Tbl_Penalized.objects.all()
    serializer_class = PenalizedSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Tbl_Category.objects.all()
    serializer_class = CategorySerializer


class ActivityDetailViewSet(viewsets.ModelViewSet):
    queryset = Tbl_activity_detail.objects.all()
    serializer_class = ActivityDetailSerializer


class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = tbl_activities.objects.all()
    serializer_class = ActivitiesSerializer


class AccomplishmentsViewSet(viewsets.ModelViewSet):
    queryset = Tbl_accomplishments_history.objects.all()
    serializer_class = AccomplishmentsSerializer
@api_view(['GET'])
def generar_desafio(request):
    user_id = request.GET.get("user_id")

    if not user_id:
        return Response({"error": "user_id requerido"}, status=400)

    try:
        user = Tbl_users.objects.get(Id=user_id)
    except Tbl_users.DoesNotExist:
        return Response({"error": "Usuario no existe"}, status=404)

    hoy = timezone.now().date()

    # ✅ 1. Ver si ya tiene desafío hoy
    registro_hoy = Tbl_accomplishments_history.objects.filter(
        Id_Users=user,
        Create_at__date=hoy
    ).first()

    if registro_hoy:
        actividad = registro_hoy.Id_activity
    else:
        # ✅ 2. Obtener actividades ya usadas
        usadas = Tbl_accomplishments_history.objects.filter(
            Id_Users=user
        ).values_list('Id_activity', flat=True)

        disponibles = tbl_activities.objects.exclude(
            Id__in=usadas
        )

        # ✅ 3. Si ya usó todas, resetear
        if not disponibles.exists():
            disponibles = tbl_activities.objects.all()

        actividad = random.choice(list(disponibles))

        # ✅ 4. Guardar en historial
        Tbl_accomplishments_history.objects.create(
            Id_Users=user,
            Id_activity=actividad
        )

    # ✅ 5. Generar texto con IA
    ia = ConfiguracionIA()
    desafio = ia.traer_desafio(user)

    return Response({
        "actividad_id": actividad.Id,
        "actividad": actividad.Name,
        "desafio": desafio
    })

@api_view(['POST'])
def completar_mision(request):
    user_id = request.data.get("user_id")
    activity_id = request.data.get("activity_id")

    if not user_id or not activity_id:
        return Response({"error": "user_id y activity_id requeridos"}, status=400)

    try:
        user = Tbl_users.objects.get(Id=user_id)
    except Tbl_users.DoesNotExist:
        return Response({"error": "Usuario no existe"}, status=404)

    try:
        actividad = tbl_activities.objects.get(Id=activity_id)
    except tbl_activities.DoesNotExist:
        return Response({"error": "Actividad no existe"}, status=404)

    # Verificar si ya completó esta misión hoy
    hoy = timezone.now().date()
    ya_completada = Tbl_accomplishments_history.objects.filter(
        Id_Users=user,
        Id_activity=actividad,
        Create_at__date=hoy,
        completed=True
    ).exists()

    if ya_completada:
        return Response({"error": "Misión ya completada hoy"}, status=400)

    # Marcar como completada
    logro, _ = Tbl_accomplishments_history.objects.get_or_create(
        Id_Users=user,
        Id_activity=actividad,
        Create_at__date=hoy
    )
    logro.completed = True
    logro.save()

    # Sumar XP al usuario
    user.xp += actividad.xp
    user.level = str(int(user.xp / 100) + 1)
    user.save()

    return Response({
        "mensaje": "Misión completada",
        "xp_ganado": actividad.xp,
        "xp_total": user.xp,
        "level": user.level
    })