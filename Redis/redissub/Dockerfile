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