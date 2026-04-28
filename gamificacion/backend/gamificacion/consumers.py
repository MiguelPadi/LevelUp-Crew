import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PruebaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(json.dumps({
            'mensaje': 'Conexión WebSocket exitosa'
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.send(json.dumps({
            'respuesta': f"Recibido: {data}"
        }))