# ela-server
Servidor NodeJS para las votaciones de enmienda del MNU Los Arrayanes

## Requisitos
* NodeJS
* Node Package Manager (solo para la instalación)

## Instalación
* Clonar el repositorio (o descargarlo).
* En un terminal (estando en el directiorio donde se descargó el repositorio),
```
  npm install
```
... para obtener todos los paquetes node necesarios.
* Iniciar el Servidor
```
  node index.js
```

# Ejemplos
Tomando en cuenta la IP 192.168.0.101 como la IP de la máquina que hace de servidor, y desde un __navegador__
* Ver las estadísticas
    `http://192.168.0.101:3000/`
* Añadir un voto a favor
    `http://192.168.0.101:3000/addAFavor`
* Añadir un voto en contra
    `http://192.168.0.101:3000/addEnContra`
* Añadir una abstención
    `http://192.168.0.101:3000/addAbstencion`
* Hacer una nueva votación
    `http://192.168.0.101:3000/nuevaVotacion`
