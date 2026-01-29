# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Geovisor (geographic viewer) displaying spatial and population coverage of "Pilares para el Bienestar" facilities in Mexico. Built as a static web application using MapLibre GL JS for interactive mapping.

## Running the Application

This is a static web app with no build step. Serve locally with any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Open `http://localhost:8000` in browser.

## Architecture

**Frontend Stack:**
- MapLibre GL JS v5.6.2 (via CDN) for map rendering
- Vanilla JavaScript with ES6 modules
- CARTO Positron basemap tiles

**Key Files:**
- `index.html` - Entry point, loads map container and sidebar UI
- `src/js/main.js` - Initializes map instance and loads modules
- `src/js/config.js` - Map configuration (center, zoom, extents, tile sources)
- `src/js/01_cargarCapas.js` - Loads GeoJSON layers (municipios, coberturas, pilares)
- `src/js/02_filtro.js` - Filter functionality and sidebar list rendering
- `src/js/popup.js` - Popup HTML generation for feature clicks
- `src/js/controls.js` - Custom map controls (extent zoom button)

**Data Layers (GeoJSON):**
- `src/assets/data/pilares.geojson` - Point locations of Pilares facilities
- `src/assets/data/coberturas_pilares_datos.geojson` - Coverage polygons
- `src/assets/data/alcaldias.geojson` - Municipal boundaries

**Data Processing:**
- `notebooks/nb_procesamiento.ipynb` - Jupyter notebook for data preparation
- Python venv with geopandas/pyogrio for geospatial processing

## Module Pattern

JavaScript modules use named exports and are loaded via ES6 imports in `main.js`:

```javascript
import { mapConfig } from './config.js';
import { cargarCapas } from './01_cargarCapas.js';
```

Layers are added in `map.on('load', ...)` callback. Filter functions attach event listeners to sidebar DOM elements.

## Map Sources and Layers

Source IDs follow pattern: `{nombre}_source`
Layer IDs follow pattern: `{nombre}_layer` or `{nombre}_fill`/`{nombre}_outline`

Current sources: `municipios_source`, `coberturas_pilares_source`, `pilares_source`
