# Proyecto_SO1_G33

El proposito del proyecto es comprender la concurrencia y la teoria del paralelismo para desarrollar sistemas distribuidos. 

## Arquitectura utilizada

![Arquitecura](ImagenesWeb/Arquitectura.png)

## Manual Tecnico


| Servicio | Manual |
| ------ | ------ |
| API | [Api/README.md](Api/README.md) |
| FRONTEND | [frontend/README.md](frontend/README.md) |
| GRPC CLIENT | [gRPC/Client/README.md](gRPC/Client/README.md) |
| GRPC SERVER | [gRPC/Server/README.md](gRPC/Server/README.md) |
| MYSQL | [Database/README.md](SQL/README.md) |
| LOCUST | [Database/README.md](locust/README.md) |
| REDIS | [Redis/Redis-server/README.md](Redis/Redis-server/README.md) |
| REDISPUB | [Redis/redispub/README.md](Redis/redispub/README.md) |
| REDISSUB | [Redis/redissub/README.md](Redis/redissub/README.md) |
| k8s | [k8s/README.md](k8s/README.md) |


---
## Manual Usuario
La aplicacion unicamente cuenta de unica ventana la cual muestra los datos ingresados dentro de las bases de datos.

Para acceder a la web ingrese en el sigueinte link: 
*https://votosreact-tqkpgyghaq-uc.a.run.app*

Una vez dentro del sitio podra visualizar un dashboard con multiples graficas y una grafica la cual presentan diferentes estadisticas con el total de votos y porcentajes de cada una de las metricas solicitadas.

![Web](ImagenesWeb/Web.png)

### Top 3 de departamentos con mayores votos para presidente
![Grafica Top](ImagenesWeb/Top.png)

### Porcentaje de votos por partido segun Municipio
![Grafica VMunicipio](ImagenesWeb/VMunicipio.png)

### Porcentaje de votos por partido segun Departamento
![Grafica VDepartamento](ImagenesWeb/VDepartamento.png)

### Tabla con todos los votos ingresados
![Tabla General](ImagenesWeb/Tabla.png)

### Tabla con los ultimos 5 votos ingresados, así como las 5 sedes con mayor cantidad de votos almacenados
![Ultimos Votos](ImagenesWeb/Ultimos.png)

En caso de que la informacion en las graficas o tabla no se cargue debe ir a configuraciones del sitio y perimitir el contenido no seguro.

![Error](ImagenesWeb/Error.jpeg)