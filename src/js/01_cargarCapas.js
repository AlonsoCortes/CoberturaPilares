export function cargarCapas(map) {
  const estilos = getComputedStyle(document.documentElement);

  map.on('load', () => {
    // === Capa de municipios ===
    map.addSource('municipios_source', {
      type: 'geojson',
      data: './src/assets/data/entidades_municipal.geojson'
    });

    map.addLayer({
      id: 'municipios_layer',
      type: 'line',
      source: 'municipios_source',
      paint: {
        'line-color': '#000000ff',
        'line-width': 0.1,
        'line-opacity': 0.1,
      }
    });
    // === Capa de estados ===
    map.addSource('estados_source', {
      type: 'geojson',
      data: './src/assets/data/entidades_estatales.geojson'
    });

    map.addLayer({
      id: 'estados_layer',
      type: 'line',
      source: 'estados_source',
      paint: {
        'line-color': '#000000ff',
        'line-width': 0.5,
        'line-opacity': 1,
      }
    });
    
    // === Capa de proyectos ===
    map.addSource('infra_source', {
      type: 'geojson',
      data: './src/assets/data/infraestructura_cientifica.geojson'
    });

    map.addLayer({
      id: 'infra_layer',
      type: 'circle',
      source: 'infra_source',
      paint: {
        'circle-color': '#A3E4D7',
        'circle-radius': 4,
        'circle-stroke-width': 0.1,
        'circle-stroke-color': '#000000ff'
        }
    });











  })
}