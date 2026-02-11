import * as Plot from "@observablehq/plot";

const COLORES = {
  primary: "#48C9B0",
  light: "#A3E4D7",
  dark: "#117864",
  medium: "#17A589",
  deep: "#0E6251",
  ref: "#E74C3C"
};

const GRUPOS_EDAD = [
  { key: "edad_0-2",   label: "0-2" },
  { key: "edad_3-5",   label: "3-5" },
  { key: "edad_6-11",  label: "6-11" },
  { key: "edad_12-14", label: "12-14" },
  { key: "edad_15-17", label: "15-17" },
  { key: "edad_18-24", label: "18-24" },
  { key: "edad_30-49", label: "30-49" },
  { key: "edad_50-59", label: "50-59" },
  { key: "edad_60-64", label: "60-64" },
  { key: "edad_65+",   label: "65+" }
];

function agregarDatos(features) {
  const n = features.length;
  if (n === 0) return null;

  // Sumas absolutas
  let pobtotal = 0, mujeres = 0, hombres = 0;
  let discapacidad = 0, desocupada = 0, nacidoOtro = 0;
  const edadSumas = {};
  GRUPOS_EDAD.forEach(g => edadSumas[g.key] = 0);

  // Promedios ponderados de escolaridad
  let escoPromSum = 0, escoMujSum = 0, escoHomSum = 0, pesoTotal = 0;

  features.forEach(f => {
    const p = f.properties;
    const pob = p.Pobtotal || 0;

    pobtotal += pob;
    mujeres += p.Mujeres || 0;
    hombres += p.Hombres || 0;
    discapacidad += p.PobConDiscapacidad || 0;
    desocupada += p.PobDesocupada || 0;
    nacidoOtro += p["NacidoOtroPaís"] || 0;

    GRUPOS_EDAD.forEach(g => {
      edadSumas[g.key] += p[g.key] || 0;
    });

    if (pob > 0) {
      escoPromSum += (p.EscoProm || 0) * pob;
      escoMujSum += (p.EscoPromMujeres || 0) * pob;
      escoHomSum += (p.EscoPromHombres || 0) * pob;
      pesoTotal += pob;
    }
  });

  // Porcentajes de edad calculados sobre las sumas
  const edadData = GRUPOS_EDAD.map(g => ({
    grupo: g.label,
    porcentaje: pobtotal > 0 ? (edadSumas[g.key] / pobtotal) * 100 : 0
  }));

  const pctMujeres = pobtotal > 0 ? (mujeres / pobtotal) * 100 : 0;
  const pctHombres = pobtotal > 0 ? (hombres / pobtotal) * 100 : 0;

  const escoProm = pesoTotal > 0 ? escoPromSum / pesoTotal : 0;
  const escoMuj = pesoTotal > 0 ? escoMujSum / pesoTotal : 0;
  const escoHom = pesoTotal > 0 ? escoHomSum / pesoTotal : 0;

  const pctDiscapacidad = pobtotal > 0 ? (discapacidad / pobtotal) * 100 : 0;
  const pctDesocupada = pobtotal > 0 ? (desocupada / pobtotal) * 100 : 0;
  const pctNacidoOtro = pobtotal > 0 ? (nacidoOtro / pobtotal) * 100 : 0;

  return {
    pobtotal, mujeres, hombres,
    pctMujeres, pctHombres,
    edadData,
    escoProm, escoMuj, escoHom,
    pctDiscapacidad, pctDesocupada, pctNacidoOtro,
    numPilares: n
  };
}

function renderGraficaEdad(contenedor, datos, width, ref) {
  contenedor.innerHTML = "";
  if (!datos) return;

  const maxVals = datos.edadData.map(d => d.porcentaje);
  if (ref) maxVals.push(...ref.edadData.map(d => d.porcentaje));
  const maxX = Math.max(...maxVals) * 1.25;

  const marks = [
    Plot.barX(datos.edadData, {
      x: "porcentaje",
      y: "grupo",
      fill: COLORES.primary,
      tip: true
    }),
    Plot.text(datos.edadData, {
      x: "porcentaje",
      y: "grupo",
      text: d => d.porcentaje.toFixed(1) + "%",
      dx: 4,
      textAnchor: "start",
      fontSize: 10
    }),
    Plot.ruleX([0])
  ];

  if (ref) {
    marks.push(
      Plot.tickX(ref.edadData, {
        x: "porcentaje",
        y: "grupo",
        stroke: COLORES.ref,
        strokeWidth: 2,
        strokeDasharray: "4 2"
      })
    );
  }

  const chart = Plot.plot({
    width,
    height: 220,
    marginLeft: 50,
    marginRight: 40,
    x: { label: "%", domain: [0, maxX] },
    y: { label: null, domain: datos.edadData.map(d => d.grupo) },
    marks
  });
  contenedor.appendChild(chart);
}

function renderGraficaGenero(contenedor, datos, width, ref) {
  contenedor.innerHTML = "";
  if (!datos) return;

  const generoData = [
    { categoria: "Mujeres", porcentaje: datos.pctMujeres, absoluto: datos.mujeres },
    { categoria: "Hombres", porcentaje: datos.pctHombres, absoluto: datos.hombres }
  ];

  const marks = [
    Plot.barX(generoData, {
      x: "porcentaje",
      y: "categoria",
      fill: d => d.categoria === "Mujeres" ? COLORES.medium : COLORES.dark,
      tip: true
    }),
    Plot.text(generoData, {
      x: "porcentaje",
      y: "categoria",
      text: d => d.porcentaje.toFixed(1) + "%",
      dx: 4,
      textAnchor: "start",
      fontSize: 10
    }),
    Plot.ruleX([0])
  ];

  if (ref) {
    const refGenero = [
      { categoria: "Mujeres", porcentaje: ref.pctMujeres },
      { categoria: "Hombres", porcentaje: ref.pctHombres }
    ];
    marks.push(
      Plot.tickX(refGenero, {
        x: "porcentaje",
        y: "categoria",
        stroke: COLORES.ref,
        strokeWidth: 2,
        strokeDasharray: "4 2"
      })
    );
  }

  const chart = Plot.plot({
    width,
    height: 100,
    marginLeft: 60,
    marginRight: 50,
    x: { label: "%", domain: [0, 100] },
    y: { label: null },
    marks
  });
  contenedor.appendChild(chart);

  const info = document.createElement("p");
  info.style.cssText = "font-size:0.75rem;color:#424949;margin:0.2rem 0 0 0;";
  info.textContent = `Población total: ${Math.round(datos.pobtotal).toLocaleString("es-MX")}`;
  contenedor.appendChild(info);
}

function renderGraficaEscolaridad(contenedor, datos, width, ref) {
  contenedor.innerHTML = "";
  if (!datos) return;

  const escoData = [
    { categoria: "General", valor: datos.escoProm },
    { categoria: "Mujeres", valor: datos.escoMuj },
    { categoria: "Hombres", valor: datos.escoHom }
  ];

  const allVals = escoData.map(d => d.valor);
  if (ref) allVals.push(ref.escoProm, ref.escoMuj, ref.escoHom);
  const maxVal = Math.max(...allVals);

  const marks = [
    Plot.barX(escoData, {
      x: "valor",
      y: "categoria",
      fill: d => {
        if (d.categoria === "General") return COLORES.primary;
        if (d.categoria === "Mujeres") return COLORES.medium;
        return COLORES.dark;
      },
      tip: true
    }),
    Plot.text(escoData, {
      x: "valor",
      y: "categoria",
      text: d => d.valor.toFixed(1),
      dx: 4,
      textAnchor: "start",
      fontSize: 10
    }),
    Plot.ruleX([0])
  ];

  if (ref) {
    const refEsco = [
      { categoria: "General", valor: ref.escoProm },
      { categoria: "Mujeres", valor: ref.escoMuj },
      { categoria: "Hombres", valor: ref.escoHom }
    ];
    marks.push(
      Plot.tickX(refEsco, {
        x: "valor",
        y: "categoria",
        stroke: COLORES.ref,
        strokeWidth: 2,
        strokeDasharray: "4 2"
      })
    );
  }

  const chart = Plot.plot({
    width,
    height: 120,
    marginLeft: 60,
    marginRight: 50,
    x: { label: "Años", domain: [0, maxVal * 1.2 || 15] },
    y: { label: null },
    marks
  });
  contenedor.appendChild(chart);
}

function renderGraficaSocial(contenedor, datos, width, ref) {
  contenedor.innerHTML = "";
  if (!datos) return;

  const socialData = [
    { indicador: "Discapacidad", porcentaje: datos.pctDiscapacidad },
    { indicador: "Desempleo", porcentaje: datos.pctDesocupada },
    { indicador: "Nacido extranjero", porcentaje: datos.pctNacidoOtro }
  ];

  const allVals = socialData.map(d => d.porcentaje);
  if (ref) allVals.push(ref.pctDiscapacidad, ref.pctDesocupada, ref.pctNacidoOtro);
  const maxVal = Math.max(...allVals);

  const marks = [
    Plot.barX(socialData, {
      x: "porcentaje",
      y: "indicador",
      fill: COLORES.light,
      stroke: COLORES.dark,
      tip: true
    }),
    Plot.text(socialData, {
      x: "porcentaje",
      y: "indicador",
      text: d => d.porcentaje.toFixed(2) + "%",
      dx: 4,
      textAnchor: "start",
      fontSize: 10
    }),
    Plot.ruleX([0])
  ];

  if (ref) {
    const refSocial = [
      { indicador: "Discapacidad", porcentaje: ref.pctDiscapacidad },
      { indicador: "Desempleo", porcentaje: ref.pctDesocupada },
      { indicador: "Nacido extranjero", porcentaje: ref.pctNacidoOtro }
    ];
    marks.push(
      Plot.tickX(refSocial, {
        x: "porcentaje",
        y: "indicador",
        stroke: COLORES.ref,
        strokeWidth: 2,
        strokeDasharray: "4 2"
      })
    );
  }

  const chart = Plot.plot({
    width,
    height: 120,
    marginLeft: 110,
    marginRight: 50,
    x: { label: "%", domain: [0, maxVal * 1.3 || 5] },
    y: { label: null },
    marks
  });
  contenedor.appendChild(chart);
}

export function graficas(map) {
  const panel = document.getElementById("panelGraficas");
  const subtitulo = document.getElementById("panelSubtitulo");
  const leyendaRef = document.getElementById("panelLeyendaRef");

  const contenedores = {
    edad: document.getElementById("graficaEdad"),
    genero: document.getElementById("graficaGenero"),
    escolaridad: document.getElementById("graficaEscolaridad"),
    social: document.getElementById("graficaSocial")
  };

  let ultimosDatos = null;
  let datosGlobales = null;
  let alcaldiaActual = "all";

  function getWidth() {
    const w = contenedores.edad.clientWidth;
    return w > 0 ? w : 250;
  }

  function renderAll(datos) {
    const width = getWidth();
    const ref = (alcaldiaActual !== "all" && datosGlobales) ? datosGlobales : null;
    renderGraficaEdad(contenedores.edad, datos, width, ref);
    renderGraficaGenero(contenedores.genero, datos, width, ref);
    renderGraficaEscolaridad(contenedores.escolaridad, datos, width, ref);
    renderGraficaSocial(contenedores.social, datos, width, ref);
  }

  function actualizarGraficas(alcaldia, features) {
    alcaldiaActual = alcaldia;
    subtitulo.textContent = alcaldia === "all" ? "Todas las alcaldías" : alcaldia;
    const datos = agregarDatos(features);
    ultimosDatos = datos;

    if (alcaldia === "all" && !datosGlobales) {
      datosGlobales = datos;
    }

    leyendaRef.style.display = (alcaldia !== "all" && datosGlobales) ? "flex" : "none";
    renderAll(datos);
  }

  document.addEventListener("filtro:cambio", (e) => {
    const { alcaldia, features } = e.detail;
    actualizarGraficas(alcaldia, features);
  });

  // ResizeObserver con debounce
  let resizeTimer;
  const observer = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (ultimosDatos) {
        renderAll(ultimosDatos);
      }
    }, 250);
  });
  observer.observe(panel);
}
