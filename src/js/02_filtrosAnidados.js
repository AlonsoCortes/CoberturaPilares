import { acercamientoEntidad } from "./03_acercamientoFiltro.js";

export function filtrosAnidados(map) {
  const filtroPrimario = document.getElementById('filtro1');
  const filtroSecundario = document.getElementById('filtro2');

  let geojsonData; // guardará los datos del GeoJSON

  // === 1️⃣ Cargar el GeoJSON ===
  fetch('./src/assets/data/infraestructura_cientifica.geojson')
    .then(res => res.json())
    .then(data => {
      geojsonData = data;

      // Obtener entidades primarias únicas (estados)
      const entPrimarias = [...new Set(data.features.map(f => f.properties.ent_estado))];
      entPrimarias.sort();

      // Llenar el primer select
      entPrimarias.forEach(entidad => {
        const opt = document.createElement('option');
        opt.value = entidad;
        opt.textContent = entidad;
        filtroPrimario.appendChild(opt);
      });
    });

  // === 2️⃣ Evento: cambio en el primer filtro (estado) ===
  filtroPrimario.addEventListener('change', () => {
    const estadoSeleccionado = filtroPrimario.value;

    // Reiniciar segundo select (municipios)
    filtroSecundario.innerHTML = '<option value="">-- Selecciona un municipio --</option>';
    filtroSecundario.disabled = !estadoSeleccionado;

    if (!estadoSeleccionado) {
      // Si no hay estado seleccionado, mostrar toda la capa
      map.setFilter('infra_layer', null);
      return;
    }
    // Acercamiento a entidad seleccionada
    acercamientoEntidad(
      map,
      './src/assets/data/entidades_estatales.geojson',
      'NOMGEO',
      estadoSeleccionado
    )

    // Filtrar municipios que correspondan al estado seleccionado
    const municipios = [
      ...new Set(
        geojsonData.features
          .filter(f => f.properties.ent_estado === estadoSeleccionado)
          .map(f => f.properties.ent_mun)
      )
    ];
    municipios.sort();

    // Llenar el segundo select
    municipios.forEach(mun => {
      const opt = document.createElement('option');
      opt.value = mun;
      opt.textContent = mun;
      filtroSecundario.appendChild(opt);
    });



    // Mostrar solo el estado seleccionado en el mapa
    map.setFilter('infra_layer', ['==', ['get', 'ent_estado'], estadoSeleccionado]);
  });

  // === 3️⃣ Evento: cambio en el segundo filtro (municipio) ===
  filtroSecundario.addEventListener('change', () => {
    const municipioSeleccionado = filtroSecundario.value;
    const estadoSeleccionado = filtroPrimario.value;

    if (!municipioSeleccionado) {
      // Si no hay municipio seleccionado, mostrar todo el estado
      map.setFilter('infra_layer', ['==', ['get', 'ent_estado'], estadoSeleccionado]);
    } else {
      // Mostrar solo el municipio seleccionado
      map.setFilter('infra_layer', ['==', ['get', 'ent_mun'], municipioSeleccionado]);
    }
     // Acercamiento a municipios
    // Acercamiento a entidad seleccionada
    acercamientoEntidad(
      map,
      './src/assets/data/entidades_municipal.geojson',
      'nom_mun',
      municipioSeleccionado
    )
  });

 




}

