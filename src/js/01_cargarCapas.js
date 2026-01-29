import { generarPopupCoberturaHTML } from './popup.js';

export function cargarCapas(map) {
  const estilos = getComputedStyle(document.documentElement);

  map.on('load', () => {
    // === Capa de municipios ===
    map.addSource('municipios_source', {
      type: 'geojson',
      data: './src/assets/data/alcaldias.geojson'
    });

    map.addLayer({
      id: 'municipios_layer',
      type: 'line',
      source: 'municipios_source',
      paint: {
        'line-color': '#000000ff',
        'line-width': 0.5,
        'line-opacity': 1,
      }
    });
    // === Capa de cobertura pilares ===
    map.addSource('coberturas_pilares_source', {
      type: 'geojson',
      data: './src/assets/data/coberturas_pilares_datos.geojson'
    });

    map.addLayer({
      id: 'coberturas_pilares_fill',
      type: 'fill',
      source: 'coberturas_pilares_source',
      paint: {
        'fill-color': '#48C9B0',
        'fill-opacity': 0.4
      }
    });
    // Capa de borde del polígono
    map.addLayer({
      id: 'coberturas_pilares_outline',
      type: 'line',
      source: 'coberturas_pilares_source',
      paint: {
        'line-color': '#117864',
        'line-width': 0.5,
        'line-opacity': 1
      }
    });

    
    // === Capa de pilares ===
    map.addSource('pilares_source', {
      type: 'geojson',
      data: './src/assets/data/pilares.geojson'
    });
    map.addLayer({
      id: 'pilares_layer',
      type: 'circle',
      source: 'pilares_source',
      paint: {
        'circle-radius': 2,
        'circle-color': '#0E6251 ',  // Orange/red color to stand out
        'circle-stroke-width': 1,
        'circle-stroke-color': '#0E6251  ',  // White border
        'circle-opacity': 1
  }
    });

    // === Click en capa de coberturas ===
    map.on('click', 'coberturas_pilares_fill', (e) => {
      const props = e.features[0].properties;
      const popupHTML = generarPopupCoberturaHTML(props);

      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupHTML)
        .addTo(map);
    });

    // Cambiar cursor al pasar sobre coberturas
    map.on('mouseenter', 'coberturas_pilares_fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'coberturas_pilares_fill', () => {
      map.getCanvas().style.cursor = '';
    });

  })
}