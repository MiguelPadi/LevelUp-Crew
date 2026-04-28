from channels.generic.websocket import AsyncWebsocketConsumer
import json

class PruebaConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Acepta la conexión
        await self.accept()
        
        # Envía un mensaje inicial al cliente
        await self.send(text_data=json.dumps({
            'message': 'Conexión establecida'
        }))

    async def disconnect(self, close_code):
        # Se ejecuta cuando el cliente se desconecta
        print(f"Desconectado con código: {close_code}")

    async def evento(self, text_data):        
        data = json.loads(text_data)
        mensaje = data.get('message', '')

        print(f"Mensaje recibido: {mensaje}")

        await self.send(text_data=json.dumps({
            'message': f"Servidor recibió: {mensaje}"
        }))       
        