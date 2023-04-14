drop database if exists Votaciones;
Create database if not exists Votaciones;
use Votaciones;

create table if not exists Voto (
    Sede int,
    Municipio varchar(30),
    Departamento varchar(30),
    Papeleta varchar(10),
    Partido varchar(10)
);

Drop procedure if exists topDPresidente;
DELIMITER &&
create procedure topDPresidente()
    begin
        select Departamento, count(*) as cantVotos from Voto where Papeleta='blanca' group by Departamento order by cantVotos desc limit 3;
    end &&
DELIMITER ;

Drop procedure if exists cantVotosD;
DELIMITER &&
create procedure cantVotosD()
    begin
        select Departamento, Partido, count(*) as cantVotos from Voto group by Departamento,Partido;
    end &&
DELIMITER ;

Drop procedure if exists cantVotosM;
DELIMITER &&
create procedure cantVotosM()
    begin
        select Municipio, Partido, count(*) as cantVotos from Voto group by Municipio,Partido;
    end &&
DELIMITER ;

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
