from django.urls import re_path
from gamificacion.consumers import PruebaConsumer

websocket_urlpatterns = [
    re_path(r'ws/prueba/$', PruebaConsumer.as_asgi()),
]