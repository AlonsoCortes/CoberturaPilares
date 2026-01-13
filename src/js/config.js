export const mapConfig = {
  
  center: [-102, 23], // CDMX
  zoom: 4,
  // Se pueden definir limites, en caso de tener solo uno usar bounds
  //bounds: [
  //  [-120, 11], // Suroeste
  //  [-85, 34]   // Noreste
  //],
  //  En caso de tener varios, se usa extents, estos se pueden llamar para distintas funciones
  extents: {
    nacional: [[-120, 11], [-85, 34]],
    cdmx: [[-99.36, 19.20], [-98.80, 19.60]],
    bajio: [[-103.5, 19.5], [-100.5, 22.5]]
  },
  
  styles: {
    Claro: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    
  },
  defaultStyle: 'Claro'
};
