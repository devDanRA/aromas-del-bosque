"use strict";

const BUSINESS = {
  name: "Aromas del Bosque",
  address: "Calle de Atocha 27, Madrid, España",
  coords: [40.4121, -3.7003]
};

let map;
let userMarker;
let routeLayer;

function activarEnlaceActual() {
  const active = document.getElementById("act");
  if (active) {
    active.style.textDecoration = "underline #999966";
  }
}

function activarNavFija() {
  const nav = document.getElementById("nav-bar");
  if (!nav) {
    return;
  }

  const actualizarNav = () => {
    if (window.scrollY > 130) {
      nav.classList.add("fixed-nav");
    } else {
      nav.classList.remove("fixed-nav");
    }
  };

  window.addEventListener("scroll", actualizarNav);
  actualizarNav();
}

function initMap() {
  map = L.map("map").setView(BUSINESS.coords, 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker(BUSINESS.coords)
    .addTo(map)
    .bindPopup(`<div><p class="popup-title">${BUSINESS.name}</p><p>${BUSINESS.address}</p></div>`)
    .openPopup();
}

async function geocodeAddress(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) {
    throw new Error("No se pudo consultar la dirección.");
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No se encontró la dirección indicada.");
  }

  return [Number(data[0].lat), Number(data[0].lon)];
}

async function getRoute(origin, destination) {
  const originPair = `${origin[1]},${origin[0]}`;
  const destinationPair = `${destination[1]},${destination[0]}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${originPair};${destinationPair}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("No se pudo calcular la ruta en este momento.");
  }

  const data = await res.json();
  if (!data.routes || !data.routes.length) {
    throw new Error("No se encontró una ruta disponible.");
  }

  return data.routes[0];
}

function clearRoute() {
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }
}

function setUserMarker(coords) {
  if (userMarker) {
    userMarker.setLatLng(coords);
    return;
  }

  userMarker = L.marker(coords).addTo(map).bindPopup("Tu ubicación");
}

function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

async function calculateRouteFromAddress() {
  const input = document.getElementById("origen");
  const result = document.getElementById("resultadoRuta");
  const address = input.value.trim();

  if (!address) {
    result.textContent = "Escribe tu dirección para calcular la ruta.";
    return;
  }

  result.textContent = "Calculando ruta...";

  try {
    const userCoords = await geocodeAddress(address);
    setUserMarker(userCoords);

    const route = await getRoute(userCoords, BUSINESS.coords);
    clearRoute();

    routeLayer = L.geoJSON(route.geometry, {
      style: { color: "#2f6f3e", weight: 5 }
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds(), { padding: [30, 30] });

    result.textContent = `Distancia: ${formatDistance(route.distance)} | Tiempo estimado: ${formatDuration(route.duration)}`;
  } catch (error) {
    result.textContent = error.message;
  }
}

function calculateRouteFromGeolocation() {
  const result = document.getElementById("resultadoRuta");

  if (!navigator.geolocation) {
    result.textContent = "Tu navegador no soporta geolocalización.";
    return;
  }

  result.textContent = "Obteniendo tu ubicación...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const userCoords = [position.coords.latitude, position.coords.longitude];

      try {
        setUserMarker(userCoords);
        const route = await getRoute(userCoords, BUSINESS.coords);
        clearRoute();

        routeLayer = L.geoJSON(route.geometry, {
          style: { color: "#2f6f3e", weight: 5 }
        }).addTo(map);

        map.fitBounds(routeLayer.getBounds(), { padding: [30, 30] });

        result.textContent = `Distancia: ${formatDistance(route.distance)} | Tiempo estimado: ${formatDuration(route.duration)}`;
      } catch (error) {
        result.textContent = error.message;
      }
    },
    () => {
      result.textContent = "No se pudo obtener tu ubicación.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  activarEnlaceActual();
  activarNavFija();

  const routeButton = document.getElementById("calcularRuta");
  const geoButton = document.getElementById("usarUbicacion");

  routeButton.addEventListener("click", calculateRouteFromAddress);
  geoButton.addEventListener("click", calculateRouteFromGeolocation);
});
