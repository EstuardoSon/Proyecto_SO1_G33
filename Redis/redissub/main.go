package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/go-redis/redis/v8"
	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Papeleta struct {
	Sede         int    `json:"sede"`
	Municipio    string `json:"municipio"`
	Departamento string `json:"departamento"`
	Papeleta     string `json:"papeleta"`
	Partido      string `json:"partido"`
}

var ctx = context.Background()

var redisClient = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
})

func main() {
	fmt.Println("Inicio de Sub")
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

		id := strconv.Itoa(user.Sede) + user.Departamento + user.Municipio

		contador, err0 := redisClient.Get(ctx, id).Result()
		if err0 != nil {
			fmt.Println("Nueva sede registrada")
			err7 := redisClient.Set(ctx, id, 1, 0).Err()
			if err7 != nil {
				fmt.Println("Error registro nueva sede")
				panic(err)
			}

			sedes, err := redisClient.Get(ctx, "sedes").Result()
			if err != nil {
				fmt.Println("Error obtener sedes")
				panic(err)
			}

			if sedes == "" {
				sedes = id
			} else {
				sedes = sedes + "," + id
			}
			err7 = redisClient.Set(ctx, "sedes", sedes, 0).Err()
			if err7 != nil {
				fmt.Println("Error registro de sede en sede")
				panic(err)
			}

		} else {

			sedes, err := redisClient.Get(ctx, "sedes").Result()
			if err != nil {
				fmt.Println("Error obtener sedes")
				panic(err)
			}

			if !strings.Contains(sedes, id) {

				if sedes == "" {
					sedes = id
				} else {
					sedes = sedes + "," + id
				}
				err = redisClient.Set(ctx, "sedes", sedes, 0).Err()
				if err != nil {
					fmt.Println("Error registro de sede en sede")
					panic(err)
				}
			}

			fmt.Println(contador)
			num, err := strconv.Atoi(contador)
			if err != nil {
				fmt.Println("error string to int")
			}
			err7 := redisClient.Set(ctx, id, num+1, 0).Err()
			if err7 != nil {
				fmt.Println("Error aumento de sede")
				panic(err)
			}
		}

		valor1, err1 := redisClient.Get(ctx, "v1").Result()
		if err1 != nil {
			panic(err)
		}

		err = redisClient.Set(ctx, "v1", msg.Payload, 0).Err()
		if err != nil {
			panic(err)
		}

		valor2, err2 := redisClient.Get(ctx, "v2").Result()
		if err2 != nil {
			panic(err)
		}

		err = redisClient.Set(ctx, "v2", valor1, 0).Err()
		if err != nil {
			panic(err)
		}

		valor3, err3 := redisClient.Get(ctx, "v3").Result()
		if err3 != nil {
			panic(err)
		}

		err = redisClient.Set(ctx, "v3", valor2, 0).Err()
		if err != nil {
			panic(err)
		}

		valor4, err4 := redisClient.Get(ctx, "v4").Result()
		if err4 != nil {
			panic(err)
		}

		err = redisClient.Set(ctx, "v4", valor3, 0).Err()
		if err != nil {
			panic(err)
		}

		err = redisClient.Set(ctx, "v5", valor4, 0).Err()
		if err != nil {
			panic(err)
		}

		conexion := conectar_db()

		insertar, err := conexion.Prepare(fmt.Sprintf("INSERT INTO Voto VALUES (%d,'%s','%s','%s','%s')", user.Sede, user.Municipio, user.Departamento, user.Papeleta, user.Partido))
		if err != nil {
			panic(err.Error())
		}
		insertar.Exec()

		conexion.Close()

	}
}

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
