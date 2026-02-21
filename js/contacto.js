"use strict";

// Datos base del negocio que se muestran y se usan como destino de ruta.
const BUSINESS = {
  name: "Aromas del Bosque",
  address: "Calle de Atocha 27, Madrid, Espana",
  coords: [40.4121, -3.7003]
};

let map;
let businessMarker;
let userMarker;
let routeLayer;

// Inicializa mapa, capa base y marcador de la empresa.
function initMap() {
  map = L.map("map").setView(BUSINESS.coords, 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  businessMarker = L.marker(BUSINESS.coords)
    .addTo(map)
    .bindPopup(`<strong>${BUSINESS.name}</strong><br>${BUSINESS.address}`)
    .openPopup();
}

// Convierte una dirección escrita por el usuario en coordenadas (lat, lon).
async function geocodeAddress(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("No se pudo consultar la direccion.");
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No se encontro la direccion indicada.");
  }

  return [Number(data[0].lat), Number(data[0].lon)];
}

// Solicita la ruta de conducción entre origen y destino usando OSRM.
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
    throw new Error("No se encontro una ruta disponible.");
  }

  return data.routes[0];
}

// Elimina ruta anterior para no superponer trazados en el mapa.
function clearRoute() {
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }
}

// Crea o actualiza el marcador de la ubicación del cliente.
function setUserMarker(coords) {
  if (userMarker) {
    userMarker.setLatLng(coords);
  } else {
    userMarker = L.marker(coords).addTo(map).bindPopup("Tu ubicacion");
  }
}

// Formatea distancia en m/km para mostrarla de forma legible.
function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

// Formatea duración en minutos u horas.
function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

// Calcula ruta a partir de una dirección introducida manualmente.
async function calculateRouteFromAddress() {
  const input = document.getElementById("origen");
  const result = document.getElementById("resultadoRuta");
  const address = input.value.trim();

  if (!address) {
    result.textContent = "Escribe tu direccion para calcular la ruta.";
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

// Calcula ruta usando la geolocalización del navegador.
function calculateRouteFromGeolocation() {
  const result = document.getElementById("resultadoRuta");

  if (!navigator.geolocation) {
    result.textContent = "Tu navegador no soporta geolocalizacion.";
    return;
  }

  result.textContent = "Obteniendo tu ubicacion...";

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
      result.textContent = "No se pudo obtener tu ubicacion.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// Arranque de la página: mapa, enlace activo y eventos de botones.
document.addEventListener("DOMContentLoaded", () => {
  initMap();

  const activeLink = document.getElementById("act");
  if (activeLink) {
    activeLink.style.textDecoration = "underline #999966";
  }

  const routeButton = document.getElementById("calcularRuta");
  const geoButton = document.getElementById("usarUbicacion");

  routeButton.addEventListener("click", calculateRouteFromAddress);
  geoButton.addEventListener("click", calculateRouteFromGeolocation);
});
