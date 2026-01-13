/*
 * @function acercamientoEntidad
 * @description Centra y hace zoom al mapa según una entidad encontrada en un GeoJSON.
 * @param {maplibregl.Map} map - Instancia del mapa.
 * @param {string} dataUrl - Ruta al archivo GeoJSON (por ejemplo, './src/assets/data/entidades_estatales.geojson').
 * @param {string} campo - Nombre del campo de la propiedad que identifica la entidad (por ejemplo, 'NOMGEO' o 'ent_mun').
 * @param {string} valorSeleccionado - Valor de la entidad seleccionada.
 * @param {object} opciones - Opciones de configuración (padding, duración, etc.)
*/

export function acercamientoEntidad(
  map,
  dataUrl,
  campo,
  valorSeleccionado,
  opciones = { padding: 60, duration: 1000 }
) {
  if (!valorSeleccionado || valorSeleccionado === 'all') {
    console.warn('[acercamientoEntidad] No se proporcionó un valor válido para hacer zoom.');
    return;
  }

  fetch(dataUrl)
    .then((r) => {
      if (!r.ok) throw new Error(`Error al cargar el GeoJSON (${r.status})`);
      return r.json();
    })
    .then((geojson) => {
      const entidad = geojson.features.find(
        (f) => String(f.properties[campo]) === String(valorSeleccionado)
      );

      if (!entidad) {
        console.warn(`[acercamientoEntidad] No se encontró ${campo}="${valorSeleccionado}" en ${dataUrl}`);
        return;
      }

      const bounds = new maplibregl.LngLatBounds();

      // Soporte para Polygon y MultiPolygon
      if (entidad.geometry.type === 'Polygon') {
        entidad.geometry.coordinates[0].forEach((c) => bounds.extend(c));
      } else if (entidad.geometry.type === 'MultiPolygon') {
        entidad.geometry.coordinates.flat(2).forEach((c) => bounds.extend(c));
      } else {
        console.warn(`[acercamientoEntidad] Geometría no soportada: ${entidad.geometry.type}`);
        return;
      }

      // Centrar y hacer zoom
      map.fitBounds(bounds, opciones);
    })
    .catch((err) => console.error('[acercamientoEntidad] Error:', err));
}



// ORIGINAL
// PRUEBA
    // if (estadoSeleccionado !== "all") {
    //       fetch("./src/assets/data/entidades_estatales.geojson")
    //         .then((r) => r.json())
    //         .then((entidades) => {
    //           const entidad = entidades.features.find(
    //             (f) => f.properties.NOMGEO === estadoSeleccionado
    //           );

    //           if (entidad) {
    //             const bounds = new maplibregl.LngLatBounds();

    //             // Soporte para polígonos y multipolígonos
    //             if (entidad.geometry.type === "Polygon") {
    //               entidad.geometry.coordinates[0].forEach((c) => bounds.extend(c));
    //             } else if (entidad.geometry.type === "MultiPolygon") {
    //               entidad.geometry.coordinates
    //                 .flat(2)
    //                 .forEach((c) => bounds.extend(c));
    //             }

    //             // Aplicar zoom al extent
    //             map.fitBounds(bounds, {
    //               padding: 60,
    //               duration: 1000,
    //             });
    //           }
    //         });
    //     }
