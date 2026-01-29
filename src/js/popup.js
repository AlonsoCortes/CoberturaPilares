export function generarPopupCoberturaHTML(props) {
  const nombre = props.nombre || 'Sin nombre';
  const alcaldia = props.alcaldia || '';
  const poblacion = props.Pobtotal ? Math.round(props.Pobtotal).toLocaleString('es-MX') : '';
  const mujeres = props.pct_Mujeres ? `${props.pct_Mujeres}%` : '';
  const hombres = props.pct_Hombres ? `${props.pct_Hombres}%` : '';
  const discapacidad = props.pct_PobConDiscapacidad ? `${props.pct_PobConDiscapacidad}%` : '';
  const escolaridad = props.EscoProm ? props.EscoProm.toFixed(1) : '';

  return `
    <div class="popup-content">
      <b class="popupTitulo" style="font-size:14px; color:#0E6251;">${nombre}</b>
      ${alcaldia ? `<div style="margin-top:4px; color:#117864;"><b>${alcaldia}</b></div>` : ''}

      <hr style="margin: 6px 0; border: none; border-top: 1px solid #ddd;">
      <div style="font-size:12px;">
        ${poblacion ? `<div><b>Población total:</b> ${poblacion}</div>` : ''}
        ${mujeres && hombres ? `<div><b>Mujeres:</b> ${mujeres} | <b>Hombres:</b> ${hombres}</div>` : ''}
        ${discapacidad ? `<div><b>Con discapacidad:</b> ${discapacidad}</div>` : ''}
        ${escolaridad ? `<div><b>Escolaridad promedio:</b> ${escolaridad} años</div>` : ''}
      </div>
    </div>
  `;
}
