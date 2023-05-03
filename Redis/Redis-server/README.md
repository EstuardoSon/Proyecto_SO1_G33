# REDIS
Redis nos permite almacenar datos en la memoria RAM mediante datos de tipo clave valor, con lo cual se agiliza la consulta de datos en la ejecución de un programa, para este caso se creo un contenedor el cual mantendra una imagen de redis a la cual se podra establecer conexión y relizar las acciones corresponientes para le manejo de datos.

## Docker
Para el funcionamiento de esta aplicacion se creo la imagen de docker por medio del siguiente Dockerfile.

```Dockerfile
# Imagen base de Redis
FROM redis

# Puerto en el que se va a escuchar a Redis
EXPOSE 6379

# Comando que se ejecutará cuando se inicie el contenedor
CMD ["redis-server"]
```