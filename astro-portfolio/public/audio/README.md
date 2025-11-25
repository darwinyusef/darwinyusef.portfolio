# Audio Files Directory

Esta carpeta contiene los archivos de audio MP3 para los reproductores de tecnologías en la página de Skills.

## Archivos requeridos:

### Lenguajes de Programación
- `python-demo.mp3` - Audio demo de Python

### Frameworks Frontend
- `react-demo.mp3` - Audio demo de React

### IA/Machine Learning
- `tensorflow-demo.mp3` - Audio demo de TensorFlow

## Cómo agregar más audios:

1. Coloca tu archivo MP3 en esta carpeta
2. Actualiza el archivo `/public/languages.json`
3. Agrega el campo `audioUrl` a la tecnología correspondiente:

```json
{
  "id": 1,
  "name": "Python",
  "audioUrl": "/audio/python-demo.mp3",
  ...
}
```

## Notas:
- Los archivos deben estar en formato MP3
- Se recomienda usar audios de corta duración (30-60 segundos)
- El tamaño recomendado es menor a 2MB por archivo
- Los audios se cargarán bajo demanda (lazy loading)
