# REDIS PUB
Este cliente que al ser consumido como lo indica su nombre se publica a un canal en Redis la información recibida para que luego aquellos clientes subscritos al canal puedan recibirla.

## Main.go
Este es el archivo principal en el cual se ejecuta todo el cliente de redis pub, primero establece una conexion con redis, para posteriormente por medio del consumo de endpoint publicar datos a un canal con la finalidad de que puedan ser recibidos por redis sub.

### conexion con redis
Se identifica el contexto y se establece una conexión con redis por medio del puerto 6379, en este caso no es necesario especificar el usuario o la contraseña pues no se le colocó al redis-server, posteriormente se realiza una comprobación por medio del comando `PING` que obtiene como respuesta `PONG` si la conexión fue establecida con exito.
```go
var ctx = context.Background()

var redisClient = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
})
```

### inicialización de claves a usar
Al iniciar el cliente se setean claves con valor vacio, para que otros clientes puedan usarlas sin obtener datos de tipo null, nil o none.
```go
    err = redisClient.Set(ctx, "v1", "", 0).Err()
	if err != nil {
		panic(err)
	}

	err = redisClient.Set(ctx, "v2", "", 0).Err()
	if err != nil {
		panic(err)
	}
```

### Servicio http
Se establece el servidor para que se creen y consuman endpoints para el manejo de información

```go
    //Establecimiento de server, endpoint y respectivo puerto
func main(){
    http.HandleFunc("/Mysql", insertar)
	log.Println("Server listening on port 8016...")
    log.Fatal(http.ListenAndServe(":8016", nil))
    ...
}

//Endpint a consumir así como menejo de Headers para evitar problemas con CORS
func insertar(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    ...
}
```

### Publicación
Se obtiene los datos y son publicados por medio del cliente de Redis a un canal.

```go
    var d Papeleta
    json.NewDecoder(r.Body).Decode(&d)

    payload, err := json.Marshal(d)
    if err != nil {
        panic(err)
    }

    if err := redisClient.Publish(ctx, "send-user-data", payload).Err(); err != nil {
        panic(err)
    }

    json.NewEncoder(w).Encode(200)
```

## Docker
Para el funcionamiento de esta aplicacion se creo la imagen de docker por medio del siguiente Dockerfile.

```Dockerfile
# Version node
FROM golang:1.20.1

#Creacion del directorio de trabajo
WORKDIR /app

#Copiando archivos con las librerias necesarias
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# copiar los archivos faltantes
COPY . .

#Puerto a exponer
EXPOSE 8016

CMD ["go", "run", "main.go"]
```