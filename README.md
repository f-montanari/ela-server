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

El servidor será iniciado en el puerto 3000 (por defecto) donde estarán las estadísticas de la votación, y el sitio donde emitir los votos.

# Ejemplos
Tomando en cuenta la IP 192.168.0.101 como la IP de la máquina que hace de servidor, y desde un __navegador__
* Ver las estadísticas de votación
    `http://192.168.0.101:3000/`
* Sitio para emitir votos
    `http://192.168.0.101:3000/vote.html`
