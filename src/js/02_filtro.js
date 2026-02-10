// Función para filtrar la capa de coberturas según la alcaldía seleccionada
import { generarPopupCoberturaHTML } from "./popup.js";
import { mapConfig } from "./config.js";

// Función para calcular el centroide de un polígono
function calcularCentroide(geometry) {
  let coords = [];

  if (geometry.type === "Polygon") {
    coords = geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    coords = geometry.coordinates[0][0];
  }

  let sumX = 0, sumY = 0;
  coords.forEach(c => {
    sumX += c[0];
    sumY += c[1];
  });

  return [sumX / coords.length, sumY / coords.length];
}

export function filtro(map) {
  const filtroCategorias = document.getElementById("filtroCategorias");
  const listaEquipos = document.getElementById("listaEquipos");
  const contador = document.getElementById("contadorResultados");

  // === Cargar opciones del dropdown desde alcaldias.geojson ===
  fetch("./src/assets/data/alcaldias.geojson")
    .then((response) => response.json())
    .then((data) => {
      const alcaldias = [...new Set(data.features.map((f) => f.properties.NOMGEO))]
        .sort((a, b) => a.localeCompare(b, "es"));

      alcaldias.forEach((alcaldia) => {
        const option = document.createElement("option");
        option.value = alcaldia;
        option.textContent = alcaldia;
        filtroCategorias.appendChild(option);
      });
    });

  // === Función para renderizar la lista lateral ===
  function renderizarLista(features) {
    listaEquipos.innerHTML = "";

    if (!features.length) {
      contador.textContent = "Sin resultados";
      listaEquipos.innerHTML =
        '<p style="color:#888;">No hay Pilares en esta alcaldía.</p>';
      return;
    }

    contador.textContent = `Mostrando ${features.length} ${
      features.length === 1 ? "Pilar" : "Pilares"
    }`;

    features.forEach((f) => {
      const props = f.properties;
      const poblacion = props.Pobtotal ? Math.round(props.Pobtotal).toLocaleString('es-MX') : '';

      const item = document.createElement("div");
      item.className = "item-equipo";
      item.innerHTML = `
        <b style="color:#0E6251;">${props.nombre || "Sin nombre"}</b><br>
        <small>${props.alcaldia || ""}</small><br>
        <small>${props.direccion || ""}</small><br>
        <small>${props.horario || ""}</small><br>
        
      `;

      item.addEventListener("click", () => {
        const centroide = calcularCentroide(f.geometry);
        map.flyTo({ center: centroide, zoom: 15, speed: 1 });
        const popupHTML = generarPopupCoberturaHTML(props);

        new maplibregl.Popup()
          .setLngLat(centroide)
          .setHTML(popupHTML)
          .addTo(map);
      });

      listaEquipos.appendChild(item);
    });
  }

  // === Evento de cambio en el filtro ===
  filtroCategorias.addEventListener("change", () => {
    const alcaldiaSeleccionada = filtroCategorias.value;
    const pilaresSource = map.getSource("pilares_source");
    const coberturasSource = map.getSource("coberturas_pilares_source");

    // Filtrar pilares (solo para la capa del mapa)
    fetch("./src/assets/data/pilares.geojson")
      .then((response) => response.json())
      .then((data) => {
        let filtrados;

        if (alcaldiaSeleccionada !== "all") {
          filtrados = {
            type: "FeatureCollection",
            features: data.features.filter(
              (f) => f.properties.alcaldia === alcaldiaSeleccionada
            ),
          };
        } else {
          filtrados = data;
        }

        pilaresSource.setData(filtrados);
      });

    // Filtrar coberturas (para la capa del mapa y la lista lateral)
    fetch("./src/assets/data/coberturas_pilares_datos.geojson")
      .then((response) => response.json())
      .then((data) => {
        let filtrados;

        if (alcaldiaSeleccionada !== "all") {
          filtrados = {
            type: "FeatureCollection",
            features: data.features.filter(
              (f) => f.properties.alcaldia === alcaldiaSeleccionada
            ),
          };
        } else {
          filtrados = data;
        }

        coberturasSource.setData(filtrados);
        renderizarLista(filtrados.features);
        document.dispatchEvent(new CustomEvent("filtro:cambio", {
          detail: { alcaldia: alcaldiaSeleccionada, features: filtrados.features }
        }));
      });

    // Hacer zoom a la alcaldía seleccionada o volver a la vista original
    if (alcaldiaSeleccionada !== "all") {
      fetch("./src/assets/data/alcaldias.geojson")
        .then((r) => r.json())
        .then((alcaldias) => {
          const alcaldia = alcaldias.features.find(
            (f) => f.properties.NOMGEO === alcaldiaSeleccionada
          );

          if (alcaldia) {
            const bounds = new maplibregl.LngLatBounds();

            if (alcaldia.geometry.type === "Polygon") {
              alcaldia.geometry.coordinates[0].forEach((c) => bounds.extend(c));
            } else if (alcaldia.geometry.type === "MultiPolygon") {
              alcaldia.geometry.coordinates.flat(2).forEach((c) => bounds.extend(c));
            }

            map.fitBounds(bounds, {
              padding: 60,
              duration: 1000,
            });
          }
        });
    } else {
      map.flyTo({
        center: mapConfig.center,
        zoom: mapConfig.zoom,
        duration: 1000,
      });
    }
  });

  // === Carga inicial ===
  map.on("load", () => {
    fetch("./src/assets/data/coberturas_pilares_datos.geojson")
      .then((response) => response.json())
      .then((data) => {
        renderizarLista(data.features);
        document.dispatchEvent(new CustomEvent("filtro:cambio", {
          detail: { alcaldia: "all", features: data.features }
        }));
      });
  });
}
