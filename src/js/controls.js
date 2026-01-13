import { mapConfig } from './config.js';

// Botón para moverse a los límites definidos
export class extentControl {
    onAdd(map) {
        this._map = map;

        // Crea el contenedor principal del control
        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        // Crea el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.title = 'Vista nacional';
        button.innerHTML = '<i class="fi fi-rs-arrow-up-right-and-arrow-down-left-from-center"></i>'; // puedes usar un ícono o texto
        button.className = 'maplibregl-ctrl-icon';

        // Acción al hacer clic
        button.addEventListener('click', () => {
            map.fitBounds(mapConfig.extents.nacional); // existen otras opciones (eg) nacional, cdmx, bajio
        });

        // Añade el botón al contenedor
        this._container.appendChild(button);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

