# DATABASE
Esta base de datos trabajada en MySQL consta unicamente de una tabla en la cual se registran todos los datos.

```
# Creacion de la base de datos Votaciones
drop database if exists Votaciones;
Create database if not exists Votaciones;
use Votaciones;

# Creacion de la tabla Voto y sus campos
create table if not exists Voto (
    Sede int,
    Municipio varchar(30),
    Departamento varchar(30),
    Papeleta varchar(10),
    Partido varchar(10)
);

# Eliminacion y creacion del procedimiento topDPresidente

Drop procedure if exists topDPresidente;
DELIMITER &&
create procedure topDPresidente()
    begin
        select Departamento, count(*) as cantVotos from Voto where Papeleta='blanca' group by Departamento order by cantVotos desc limit 3;
    end &&
DELIMITER ;

# Eliminacion y creacion del procedimiento cantVotosD

Drop procedure if exists cantVotosD;
DELIMITER &&
create procedure cantVotosD()
    begin
        select Departamento, Partido, count(*) as cantVotos from Voto group by Departamento,Partido;
    end &&
DELIMITER ;

# Eliminacion y creacion del procedimiento cantVotosM

Drop procedure if exists cantVotosM;
DELIMITER &&
create procedure cantVotosM()
    begin
        select Municipio, Partido, count(*) as cantVotos from Voto group by Municipio,Partido;
    end &&
DELIMITER ;

# Eliminacion y creacion del procedimiento totalVotos

Drop procedure if exists totalVotos;
DELIMITER &&
create procedure totalVotos()
    begin
        select count(*) as cantVotos from Voto;
    end &&
DELIMITER ;

call topDPresidente();
call cantVotosD();
call cantVotosM();
call totalVotos();
```

## Docker
Para el funcionamiento de esta aplicacion se creo la imagen de docker por medio del siguiente Dockerfile.

```
# Definir la imagen a utilizar
FROM mysql:8.0.32 as database

# Copiar el archivo sql dentro de la imagen
COPY ./Votaciones.sql /docker-entrypoint-initdb.d

# Exponer el puerto 3306
EXPOSE 3306
```