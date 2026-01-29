# Cobertura Pilares

Geovisor interactivo que muestra la cobertura espacial y poblacional de los establecimientos **Pilares para el Bienestar** en la Ciudad de México.

https://alonsocortes.github.io/CoberturaPilares/

## Descripción

Esta aplicación web permite visualizar:
- Ubicación de los Pilares para el Bienestar en CDMX
- Áreas de cobertura de cada Pilar (radio de **700 metros**)
- Datos poblacionales de las zonas cubiertas (población total, distribución por género, escolaridad, etc.)
- Filtrado por alcaldía

## Metodología

El área de cobertura de cada Pilar se calculó utilizando un **buffer de 700 metros** alrededor de cada establecimiento. Esta distancia representa el radio de influencia territorial que puede atender cada Pilar, considerando una distancia caminable para la población beneficiaria.

Los datos poblacionales se obtuvieron cruzando las áreas de cobertura con información del Censo de Población y Vivienda.

## Tecnologías

- **MapLibre GL JS** - Biblioteca de mapas interactivos
- **JavaScript (ES6 Modules)** - Lógica de la aplicación
- **HTML/CSS** - Estructura y estilos
- **GeoJSON** - Formato de datos geoespaciales
- **CARTO Positron** - Mapa base

## Ejecutar localmente

La aplicación es estática y no requiere compilación. Servir con cualquier servidor local:

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .
```

Abrir `http://localhost:8000` en el navegador.

## Estructura del proyecto

```
├── index.html                 # Página principal
├── src/
│   ├── css/
│   │   └── style.css          # Estilos de la aplicación
│   ├── js/
│   │   ├── main.js            # Inicialización del mapa
│   │   ├── config.js          # Configuración del mapa
│   │   ├── 01_cargarCapas.js  # Carga de capas GeoJSON
│   │   ├── 02_filtro.js       # Filtros y lista lateral
│   │   ├── popup.js           # Generación de popups
│   │   └── controls.js        # Controles personalizados
│   └── assets/
│       └── data/              # Archivos GeoJSON
│           ├── pilares.geojson
│           ├── coberturas_pilares_datos.geojson
│           └── alcaldias.geojson
└── notebooks/
    └── nb_procesamiento.ipynb # Procesamiento de datos
```

## Datos

Los datos de los Pilares provienen del portal oficial: [pilares.cdmx.gob.mx](https://pilares.cdmx.gob.mx/)

**Nota:** La información mostrada es aproximada y puede no reflejar la cobertura real de los establecimientos. Los datos están sujetos a actualizaciones y pueden contener imprecisiones derivadas de las fuentes originales.

## Autor

Desarrollado como herramienta de visualización geoespacial para análisis de cobertura de servicios públicos.
