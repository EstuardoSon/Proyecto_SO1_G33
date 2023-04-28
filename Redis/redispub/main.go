package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/go-redis/redis/v8"
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

	http.HandleFunc("/insertar", insertar)
	log.Println("Server listening on port 8016...")

	err := redisClient.Set(ctx, "v1", "", 0).Err()
	if err != nil {
		panic(err)
	}

	err = redisClient.Set(ctx, "v2", "", 0).Err()
	if err != nil {
		panic(err)
	}

	err = redisClient.Set(ctx, "v3", "", 0).Err()
	if err != nil {
		panic(err)
	}

	err = redisClient.Set(ctx, "v4", "", 0).Err()
	if err != nil {
		panic(err)
	}

	err = redisClient.Set(ctx, "v5", "", 0).Err()
	if err != nil {
		panic(err)
	}

	sedes, err := redisClient.Get(ctx, "sedes").Result()
	if err != nil {
		fmt.Println("Sedes vacio")
	} else {
		if sedes != "" {
			subsedes := strings.Split(sedes, ",")
			for _, valor := range subsedes {
				err = redisClient.Del(ctx, valor).Err()
				if err != nil {
					panic(err)
				}
			}
		}
	}

	err = redisClient.Set(ctx, "sedes", "", 0).Err()
	if err != nil {
		panic(err)
	}

	log.Fatal(http.ListenAndServe(":8016", nil))
}

func insertar(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var d Papeleta
	json.NewDecoder(r.Body).Decode(&d)

	payload, err := json.Marshal(d)
	if err != nil {
		panic(err)
	}

	if err := redisClient.Publish(ctx, "send-user-data", payload).Err(); err != nil {
		panic(err)
	}

	/* key := "ultimovoto"
	err = redisClient.Set(ctx, key, payload, 0).Err()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} */

	json.NewEncoder(w).Encode(200)

}
