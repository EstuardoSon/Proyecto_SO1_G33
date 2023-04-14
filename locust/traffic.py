from locust import HttpUser, task
from random import randrange
import json

class readFile():
    def __init__(self):
        self.data = []

    def obtener(self):
        size = len(self.data)
        if size > 0:
            index = randrange(0, size - 1) if size > 1 else 0
            return self.data.pop(index)
        else:
            return None
    
    def leer(self):
        try:
            with open('traffic.json', 'r') as archivo:
                self.data = json.loads(archivo.read())
        except Exception:
            print(f'Error : {Exception}')

class WebsiteUser(HttpUser):
    reader = readFile()
    reader.leer()


    @task
    def agregar(self):
        boleta = self.reader.obtener()

        if boleta != None:
            res = self.client.post("/Mysql", json=boleta)
            response = res.json()
            print(response)
        else:
            print("Todas las boletas registradas")
            self.stop(True)