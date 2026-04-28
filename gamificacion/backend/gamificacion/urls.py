from django.urls import path
from rest_framework.routers import DefaultRouter
from .views.date import (
    UserViewSet,
    VIPViewSet,
    PenalizedViewSet,
    CategoryViewSet,
    ActivityDetailViewSet,
    ActivitiesViewSet,
    AccomplishmentsViewSet,
    generar_desafio,
    completar_mision 
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'vip', VIPViewSet)
router.register(r'penalized', PenalizedViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'activity-detail', ActivityDetailViewSet)
router.register(r'activities', ActivitiesViewSet)
router.register(r'accomplishments', AccomplishmentsViewSet)

urlpatterns = router.urls + [
    path('ia/desafio/', generar_desafio),
    path('mision/completar/', completar_mision),
]