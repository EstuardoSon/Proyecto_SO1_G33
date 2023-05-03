# REDIS SUB
Este cliente como lo indica su nombre se subscribe a un canal en Redis en el cual recibe los datos publicados por el redis pub, para posteriormente poder manejarlos y mandarlos a la base de datos de Mysqlo a Redis para su uso en el frontend.

## Main.go
Este es el archivo principal en el cual se ejecuta todo el cliente de redis sub, primero establece una conexion con redis, para posteriormente subscribirse a un canal y obtener los datos correspondientes, con los cuales almacena nuevamente en redis aquellos necesarios para el frontend, así como establecer una conexion con una base de datos y almacenar los datos obtenidos.

### conexión con redis
Se identifica el contexto y se establece una conexión con redis por medio del puerto 6379, en este caso no es necesario especificar el usuario o la contraseña pues no se le colocó al redis-server.
```go
var ctx = context.Background()

var redisClient = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
})
```

### conexión con Mysql
```go
func conectar_db() (conexion *sql.DB) {
	Driver := "mysql"
	Usuario := "root"
	Contra := "password"
	Nombre := "Votaciones"

	conexion, err := sql.Open(Driver, fmt.Sprintf("%s:%s@tcp(votosdb:3306)/%s", Usuario, Contra, Nombre))
	if err != nil {
		panic(err.Error())
	} else {
		log.Println("Conexion a base de datos existosa")
	}
	return conexion
}
```

## Subscripción y manejo de datos
Se realiza un suscripción al canal donde los datos son enviados, posteriormente en un ciclo se reciben y manejan los mensajes recibidos del canal establecido en redis pub, estos mensajes son pasados a structs por medio de los metodos para manejar json en go.
```go
	subscriber := redisClient.Subscribe(ctx, "send-user-data")

	user := Papeleta{}

	for {
		msg, err := subscriber.ReceiveMessage(ctx)
		if err != nil {
			panic(err)
		}

		if err := json.Unmarshal([]byte(msg.Payload), &user); err != nil {
			panic(err)
		}

		fmt.Println("Received message from " + msg.Channel + " channel.")
		fmt.Printf("%+v\n", user)
    }
```

### Ingreso de datos en las bases de datos corresponientes

```go
//Redis
valor1, err1 := redisClient.Get(ctx, "v1").Result()
if err1 != nil {
	panic(err)
}

err = redisClient.Set(ctx, "v1", msg.Payload, 0).Err()
if err != nil {
	panic(err)
}

//Mysql
conexion := conectar_db()

insertar, err := conexion.Prepare(fmt.Sprintf("INSERT INTO Voto VALUES (%d,'%s','%s','%s','%s')", user.Sede, user.Municipio, user.Departamento, user.Papeleta, user.Partido))
if err != nil {
	panic(err.Error())
}
insertar.Exec()

conexion.Close()
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

CMD ["go", "run", "main.go"]
```