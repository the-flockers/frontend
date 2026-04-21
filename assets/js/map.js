document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("map");
  const apiBase = mapEl.dataset.apiBase;
  const map = L.map('map').setView([32.7157, -117.1611], 11);

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

  fetch(`${apiBase}/alpr/locations`)
    .then(res => res.json())
    .then(geojsonData => {

      L.geoJSON(geojsonData, {
        pointToLayer: function (feature, latlng) {

          const tags = feature.properties;

          const isALPR =
            tags['surveillance:type']?.toLowerCase() === 'alpr' ||
            tags['surveillance']?.toLowerCase() === 'alpr';

          if (!isALPR) return null;

          const directionStr = tags['camera:direction'] || tags['direction'];
          const rotation = getRotationDegrees(directionStr);

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

          const customIcon = L.divIcon({
            html: htmlElement,
            className: 'custom-alpr-marker',
            iconSize: rotation !== null ? [64, 64] : [18, 18],
            iconAnchor: rotation !== null ? [32, 48] : [9, 9],
            popupAnchor: rotation !== null ? [0, -8] : [0, -9]
          });

          const marker = L.marker(latlng, { icon: customIcon });

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
});
