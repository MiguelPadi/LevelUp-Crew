from google import genai

class API:
    def __init__(self):
        self.client = genai.Client(
            api_key=""
        )

    def generar_desafio(self, actividad):
        response = self.client.models.generate_content(
            model="gemini-1.5-flash",
            contents=f"""
            Genera un desafío corto y motivador basado en:
            {actividad}
            """
        )

        return response.text