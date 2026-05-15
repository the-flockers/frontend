document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("map");
  const apiBase = mapEl.dataset.apiBase;
  const geocodeBase = mapEl.dataset.geocodeBase || "https://nominatim.openstreetmap.org";

  const map = L.map('map', {
    zoomControl: false
  }).setView([32.7157, -117.1611], 11);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  function getRotationDegrees(directionStr) {
    if (!directionStr) return null;

    let degrees = parseFloat(directionStr);

    if (isNaN(degrees)) {
      const cardinals = {
        'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
        'S': 180, 'SW': 225, 'W': 270, 'NW': 315
      };
      degrees = cardinals[directionStr.toUpperCase()];
    }

    return degrees !== undefined ? degrees : null;
  }

  let alprFeatures = [];

  // Load ALPR data
  fetch(`${apiBase}/alpr/locations`)
    .then(res => res.json())
    .then(geojsonData => {
      alprFeatures = geojsonData.features || [];
      L.geoJSON(geojsonData, {
        pointToLayer: function (feature, latlng) {
          const tags = feature.properties;
          const isALPR =
            tags['surveillance:type']?.toLowerCase() === 'alpr' ||
            tags['surveillance']?.toLowerCase() === 'alpr';
          if (!isALPR) return null;

          const rotation = getRotationDegrees(tags['camera:direction'] || tags['direction']);
          let htmlElement;

          if (rotation !== null) {
            const wrapper = document.createElement("div");
            wrapper.className = "alpr-rotated";
            wrapper.style.transform = `rotate(${rotation}deg)`;
            wrapper.innerHTML = `
              <svg viewBox="0 0 64 64" width="64" height="64">
                <path d="M32 48 L12 16 Q32 0 52 16 Z"
                      fill="rgba(220, 38, 38, 0.3)"
                      stroke="rgba(220, 38, 38, 0.8)"
                      stroke-width="1.5" />
                <circle cx="32" cy="48" r="7"
                        fill="#dc2626"
                        stroke="white"
                        stroke-width="2" />
              </svg>
            `;
            htmlElement = wrapper;
          } else {
            const dot = document.createElement("div");
            dot.className = "alpr-dot";
            htmlElement = dot;
          }

          const marker = L.marker(latlng, {
            icon: L.divIcon({
              html: htmlElement,
              className: 'custom-alpr-marker',
              iconSize: rotation !== null ? [64, 64] : [18, 18],
              iconAnchor: rotation !== null ? [32, 48] : [9, 9],
              popupAnchor: rotation !== null ? [0, -8] : [0, -9]
            })
          });

          const operator = tags['operator'] || 'Unknown';
          const manufacturer = tags['manufacturer'] || tags['brand'] || 'Unknown';
          let osmIdStr = feature.id || tags['@id'] || '';

          let popupHTML = `
                        <div class="alpr-popup">
                            <h3>ALPR</h3>
                            <p><strong>Operator:</strong> ${operator}</p>
                            <p><strong>Manufacturer:</strong> ${manufacturer}</p>
                    `;

          if (osmIdStr) {
            let osmId = String(osmIdStr).replace('@', '');
            if (!isNaN(osmId)) {
              osmId = `node/${osmId}`;
            }
            popupHTML += `
                            <a href="https://www.openstreetmap.org/${osmId}"
                               target="_blank"
                               class="osm-link">
                               View on OpenStreetMap →
                            </a>`;
          }
          popupHTML += `</div>`;
          marker.bindPopup(popupHTML);
          return marker;
        }
      }).addTo(map);
    })
    .catch(err => console.error("Error loading ALPR data:", err));


  // Routing control UI
  const RoutingControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function () {
      const container = L.DomUtil.create('div', 'route-control-container leaflet-bar');
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);

      container.innerHTML = `
                <div class="route-header">Find Route</div>
                <div class="route-body">
                  <div class="route-input-group">
                    <input type="text" id="route-start" placeholder="Start address... (press Enter)" autocomplete="off" />
                    <div id="route-start-results" class="autocomplete-results"></div>
                  </div>
                  <div class="route-input-group">
                    <input type="text" id="route-end" placeholder="End address... (press Enter)" autocomplete="off" />
                    <div id="route-end-results" class="autocomplete-results"></div>
                  </div>
                  <label class="route-options">
                    <input type="checkbox" id="route-avoid-alpr" class="route-checkbox" /> Avoid ALPRs
                  </label>
                  <button id="route-btn" class="route-btn">Get Route</button>
                </div>
              `;

      const header = container.querySelector('.route-header');
      header.addEventListener('click', () => {
        container.classList.toggle('collapsed');
      });

      return container;
    }
  });

  map.addControl(new RoutingControl());

  let routeLayer = null; // store route layer to remove previous
  let avoidLayer = null;
  let startCoords = null;
  let endCoords = null;

  // OSM Nominatim
  function setupAutocomplete(inputId, resultsId, onSelect) {
    const input = document.getElementById(inputId);
    const resultsContainer = document.getElementById(resultsId);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        resultsContainer.innerHTML = '<div class="autocomplete-item">Searching...</div>';
        resultsContainer.classList.add('active');

        fetch(`${geocodeBase}/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
          .then(res => res.json())
          .then(data => {
            resultsContainer.innerHTML = '';
            if (data && data.length > 0) {
              data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.innerText = item.display_name;
                div.addEventListener('click', () => {
                  input.value = item.display_name;
                  resultsContainer.classList.remove('active');
                  const coords = [parseFloat(item.lat), parseFloat(item.lon)];
                  onSelect(coords);
                  map.flyTo(coords, 13);
                });
                resultsContainer.appendChild(div);
              });
            } else {
              resultsContainer.innerHTML = '<div class="autocomplete-item">No results found</div>';
              setTimeout(() => resultsContainer.classList.remove('active'), 2000);
            }
          })
          .catch(err => {
            console.error("Geocoding error:", err);
            resultsContainer.innerHTML = '<div class="autocomplete-item">Error fetching results</div>';
            setTimeout(() => resultsContainer.classList.remove('active'), 2000);
          });
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target !== input && e.target !== resultsContainer) {
        resultsContainer.classList.remove('active');
      }
    });
  }

  setupAutocomplete('route-start', 'route-start-results', coords => startCoords = coords);
  setupAutocomplete('route-end', 'route-end-results', coords => endCoords = coords);

  const routeBtn = document.getElementById("route-btn");
  routeBtn.addEventListener("click", () => {
    // If coords are not set but inputs have values, try to parse them as "lat, lng" as fallback
    if (!startCoords) {
      const sVal = document.getElementById('route-start').value.split(',');
      if (sVal.length === 2 && !isNaN(parseFloat(sVal[0])) && !isNaN(parseFloat(sVal[1]))) {
        startCoords = [parseFloat(sVal[0]), parseFloat(sVal[1])];
      }
    }
    if (!endCoords) {
      const eVal = document.getElementById('route-end').value.split(',');
      if (eVal.length === 2 && !isNaN(parseFloat(eVal[0])) && !isNaN(parseFloat(eVal[1]))) {
        endCoords = [parseFloat(eVal[0]), parseFloat(eVal[1])];
      }
    }

    if (!startCoords || !endCoords) {
      alert("Please search and select both start and end locations.");
      return;
    }

    routeBtn.disabled = true;
    routeBtn.innerText = "Loading...";

    const avoidAlpr = document.getElementById('route-avoid-alpr').checked;

    // ORS takes [lng, lat]
    const requestBody = {
      coordinates: [
        [startCoords[1], startCoords[0]],
        [endCoords[1], endCoords[0]]
      ]
    };

    if (avoidLayer) {
      map.removeLayer(avoidLayer);
      avoidLayer = null;
    }

    if (avoidAlpr && alprFeatures.length > 0) {
      // Filter ALPRs to only those roughly between start and end (with ~5km margin)
      const margin = 0.05;
      const minLat = Math.min(startCoords[0], endCoords[0]) - margin;
      const maxLat = Math.max(startCoords[0], endCoords[0]) + margin;
      const minLng = Math.min(startCoords[1], endCoords[1]) - margin;
      const maxLng = Math.max(startCoords[1], endCoords[1]) + margin;

      const relevantAlprs = alprFeatures.filter(f => {
        const [lng, lat] = f.geometry.coordinates;
        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
      });

      if (relevantAlprs.length > 0) {
        const avoidPolygons = {
          type: "MultiPolygon",
          coordinates: relevantAlprs.map(f => {
            const [lng, lat] = f.geometry.coordinates;
            const offset = 0.0015;
            return [[
              [lng - offset, lat - offset],
              [lng + offset, lat - offset],
              [lng + offset, lat + offset],
              [lng - offset, lat + offset],
              [lng - offset, lat - offset]
            ]];
          })
        };

        requestBody.options = {
          avoid_polygons: avoidPolygons
        };

        avoidLayer = L.geoJSON(avoidPolygons, {
          style: { color: '#ef4444', weight: 1, fillOpacity: 0.2 },
          interactive: false
        }).addTo(map);
      }
    }

    fetch(`${apiBase}/ors/directions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch route");
        return res.json();
      })
      .then(geojsonData => {
        if (routeLayer) {
          map.removeLayer(routeLayer);
        }

        // Draw the route
        routeLayer = L.geoJSON(geojsonData, {
          style: { color: avoidAlpr ? '#10b981' : '#3b82f6', weight: 5, opacity: 0.8 }
        }).addTo(map);

        // Adjust map bounds to show whole route
        if (routeLayer.getBounds().isValid()) {
          map.fitBounds(routeLayer.getBounds(), { padding: [30, 30] });
        }
      })
      .catch(err => {
        console.error("Error loading route data: ", err);
        alert("Failed to load route. Check console for details.");
      })
      .finally(() => {
        routeBtn.disabled = false;
        routeBtn.innerText = "Get Route";
      });
  });
});
