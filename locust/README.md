# LOCUST
En esta aplicacion de Python simula multiples clientes que realizan solicitudes a una API para el envio de informacion.

## Archivos

### traffic.json
Este archivo contiene un json con la informacion que sera enviada a las API para su consumo y procesamiento.

```JSON
[
    {
        "sede": 1,
        "municipio": "Guatemala",
        "departamento": "Guatemala",
        "papeleta": "Blanca",
        "partido": "UNE"
    },
    ...
]
```

### traffic.py

```PY
# Importar librerias
from locust import HttpUser, task
from random import randrange
import json

# Definir clase readFile
class readFile():

# Constructor de la clase
    def __init__(self):
        self.data = []

# Definir funcion de la clase obtener
## Funcion: Obtener un objeto del archivo traffic.json
    def obtener(self):
        size = len(self.data)
        if size > 0:
            index = randrange(0, size - 1) if size > 1 else 0
            return self.data.pop(index)
        else:
            return None

# Definir funcion de la clase leer
## Funcion: leer el archivo traffic.json
    def leer(self):
        try:
            with open('traffic.json', 'r') as archivo:
                self.data = json.loads(archivo.read())
        except Exception:
            print(f'Error : {Exception}')

# Definir la clase WebsiteUser
class WebsiteUser(HttpUser):
    reader = readFile()
    reader.leer()

# Enviar informacion al endpoint /Mysql de la API
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
```