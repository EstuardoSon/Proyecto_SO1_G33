# Kubernetes
El despliegue de todos los Backends se realiza en un cluster de kubernetes en google cloud, para su despliegue se utilizan diversos archivos Yaml.

## Archivos

### NameSpace.yaml
Creacion de un NameSpace en el cluster de nombre *proyectoso1*.

```YAML
apiVersion: v1
kind: Namespace
metadata:
  name: proyectoso1
```

### Bases.yaml
En este archivo se encuentran los services y deployments para levantar las bases de datos en kubernetes.

#### * MySQL Volumen
```YAML
apiVersion: v1  #Definir la version con la que se trabaja
kind: PersistentVolumeClaim # Tipo de componente
metadata:
  name: votosdb # Nombre del volumen
  labels:
    app: votosdb # Labels del componente
  namespace: proyectoso1 # NameSpace en el que se creara el volumen
spec:
  accessModes:
    - ReadWriteOnce # Permisos de lectura y escritura
  resources:
    requests:
      storage: 2Gi # Capacidad maxima de volumen
```

#### * MySQL Deployment
```YAML
apiVersion: apps/v1 # Version con la que se trabaja
kind: Deployment # Tipo de componente
metadata:
  labels:
    app: votosdb # Labels del componente
  name: votosdb # Nombre del deployment
  namespace: proyectoso1 # NameSpace con el que se trabajara
spec:
  replicas: 1 # Cantidad de Replicas
  selector:
    matchLabels:
      app: votosdb # Nombre del deployment
  template:
    metadata:
      labels:
        app: votosdb # Nombre aplicacion
    spec:
      containers:
      - image: estuardosonu/votosdb # Imagen de docker a utilizar
        imagePullPolicy: Always
        name: votosdb # Nombre del Pod a utilizar
        env: # Variables de Entorno
          - name: MYSQL_ROOT_PASSWORD
            value: "password"
          - name: MYSQL_USER
            value: "estuardo"
          - name: MYSQL_PASSWORD
            value: "password"
        ports: # Puerto a exponer
          - containerPort: 3306
            name: votosdb
        volumeMounts: # Volumen
          - name: mysql-volumen
            mountPath: /var/lib/mysql
      volumes: # Componente volumen a utilizar
        - name: mysql-volumen
          persistentVolumeClaim:
            claimName: votosdb
```

#### * MySQL Server
```YAML
apiVersion: v1 # Version de la aplicacion
kind: Service # Tipo de Componente
metadata:
  labels:
    app: votosdb # Labels del componente
  name: votosdb # Nombre del componente
  namespace: proyectoso1 # Nombre del NameSpace a utilizar
spec:
  type: LoadBalancer # Tipo de Service
  ports:
    - name: votosdb # Nombre del Pod
      port: 3306 # Puerto que expone el puerto
      protocol: TCP # Tipo de protocolo
      targetPort: 3306 # Puerto del PC
  selector:
    app: votosdb # Indicar que labels se utilizaran
```

### Back.yaml
En este archivo se definen los deployments y services que ayudaran a la implementacion de la API y el gRPC Server en kubernetes.

#### * GRPC Server Deployment

```YAML
apiVersion: apps/v1 # Version de Kubernetes
kind: Deployment # Tipo de componente
metadata:
  labels:
    app: votosgrpcs # Labels permitidos
  name: votosgrpcs # Nombre del Deployment
  namespace: proyectoso1 # Nombre del NameSpace
spec:
  replicas: 1 # Numero de Replicas
  selector:
    matchLabels:
      app: votosgrpcs # Labels de Pods
  template:
    metadata:
      labels:
        app: votosgrpcs # Nombre del la aplicacion
    spec:
      containers:
      - image: estuardosonu/votosgrpcs # Imagen de docker a usar
        imagePullPolicy: Always
        name: votosgrpcs # Nombre del Pod
        env: # Variables de Entorno
          - name: HOST 
            value: votosdb
          - name: USER_NAME
            value: "root"
          - name: PASSWORD
            value: "password"
          - name: DATABASE
            value: "Votaciones"
        ports:
          - containerPort: 50051 # Puerto a exponer
            name: votosgrpcs
``` 

#### * GRPC Server Service
```YAML
apiVersion: v1 # Version de Kubernetes
kind: Service # Tipo de componente
metadata:
  labels:
    app: votosgrpcs # Labels de la aplicacion
  name: votosgrpcs # Nombre del Service
  namespace: proyectoso1 # Nombre del NameSpace a usar
spec:
  type: ClusterIP # Tipo de Service
  ports:
  - port: 50051 # Puerto del Pod
    protocol: TCP # Tipo de protocolo
    targetPort: 50051 #
  selector:
    app: votosgrpcs # Nombre del Pod
```

#### * API Deployment
```YAML
apiVersion: apps/v1 # Version de kubernetes
kind: Deployment # Tipo de componente
metadata:
  labels:
    app: votosapi # Labels de para el deployment
  name: votosapi # Nombre del Deployment
  namespace: proyectoso1 # Nombre del NameSpace
spec:
  replicas: 1 # Numero de replicas
  selector:
    matchLabels:
      app: votosapi # Labels con los que debe hacer match
  template:
    metadata:
      labels:
        app: votosapi # Labels de pods
    spec:
      containers:
      - image: estuardosonu/votosapi # Imagen a usar de docker
        imagePullPolicy: Always
        name: votosapi # Nombre del contenedor
        env: # Variables de entorno
          - name: HOST
            value: votosdb
          - name: USER_NAME
            value: "root"
          - name: PASSWORD
            value: "password"
          - name: DATABASE
            value: "Votaciones"
        ports:
          - containerPort: 8080 # Puerto a exponer
            name: votosapi
```

#### * API Service
```YAML
apiVersion: v1 # Version de kubernetes
kind: Service # Tipo de componente
metadata:
  labels:
    app: votosapi # Labels del service
  name: votosapi # Nombre del service
  namespace: proyectoso1 # Nombre del NameSpace
spec:
  type: LoadBalancer # Tipo de servicio
  ports:
    - name: votosapi # Nombre del Pod
      port: 8080 # Puerto del Pod
      protocol: TCP # Tipo de protocolo
      targetPort: 8080 # Puerto del PC
  selector:
    app: votosapi
```

### Client.yaml
En este archivo se encuentra los objetos para la construccion del deployment y service del cliente de GRPC.

#### * Deployment
```YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: votosgrpcc
  name: votosgrpcc
  namespace: proyectoso1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: votosgrpcc
  template:
    metadata:
      labels:
        app: votosgrpcc
    spec:
      containers:
      - image: estuardosonu/votosgrpcc
        imagePullPolicy: Always
        name: votosgrpcc
        env:
          - name: HOST
            value: votosgrpcs
        ports:
          - containerPort: 3001
            name: votosgrpcc
```

#### * Service
```YAML
apiVersion: v1
kind: Service
metadata:
  labels:
    app: votosgrpcc
  name: votosgrpcc
  namespace: proyectoso1
spec:
  type: LoadBalancer
  ports:
    - name: votosgrpcc
      port: 3001
      protocol: TCP
      targetPort: 3001
  selector:
    app: votosgrpcc
```

# Cloud Run
Para ejecutar el frontend en cloud run se deben realizar los siguientes pasos desde la consola de google Cloud:

## Paso 1:
Hacer pull de la imagen desde DockerHub.

```
docker pull <<username>>/<<image_name>>

# En este caso 

docker pull estuardosonu/votosreact
```

## Paso 2
Agregarle tag a la imagen.

```
docker tag <<imagen>> gcr.io/<ID>/<nombre>:<version>

# En este caso
docker tag estuardosonu/votosreact gcr.io/so1-1s23-380118/votosreact
```

## Paso 3
Hacer push de la imagen tageada.

```
docker push <<imagen>>

#Este caso

docker push gcr.io/so1-1s23-380118/votosreact
```