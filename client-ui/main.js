import mapboxgl from 'mapbox-gl';
import './styles.css';

const DEFAULT_CENTER = [-98.5795, 39.8283];
const DEFAULT_ZOOM = 3;

const token = import.meta.env.MAPBOX_TOKEN || '';

const tokenBanner = document.getElementById('token-banner');
const addressButton = document.getElementById('btn-address');
const currentButton = document.getElementById('btn-current');
const defaultButton = document.getElementById('btn-default');
const addressInput = document.getElementById('address-input');
const statusArea = document.getElementById('status-area');
const toast = document.getElementById('toast');

let map;
let toastTimeout;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

function updateStatus(message) {
  if (statusArea) {
    statusArea.textContent = message;
  }
}

function ensureMapAvailable() {
  if (!map) {
    showToast('Map is unavailable without a Mapbox token.');
    return false;
  }
  return true;
}

function toggleAddressInput() {
  const nowHidden = !addressInput.hidden;
  addressInput.hidden = nowHidden;
  if (!nowHidden) {
    addressInput.focus();
  }
}

async function handleGeocode(query) {
  if (!ensureMapAvailable()) return;

  if (!query) {
    showToast('Enter an address to search.');
    return;
  }

  try {
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
    url.searchParams.set('access_token', token);
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      showToast('No results found for that address.');
      updateStatus('Geocode returned no results.');
      return;
    }

    const result = data.features[0];
    const [lng, lat] = result.center;
    map.flyTo({ center: [lng, lat], zoom: 14 });
    updateStatus(`Geocoded: ${result.place_name}`);
  } catch (error) {
    console.error(error);
    showToast('Unable to geocode the address.');
    updateStatus('Geocoding failed.');
  }
}

function centerOnDefault() {
  if (!ensureMapAvailable()) return;
  map.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  updateStatus('Reset to default view.');
}

function centerOnCurrentLocation() {
  if (!ensureMapAvailable()) return;

  if (!navigator.geolocation) {
    showToast('Geolocation is not supported in this browser.');
    updateStatus('Geolocation unsupported.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      map.flyTo({ center: [longitude, latitude], zoom: 14 });
      updateStatus('Centered on current location.');
    },
    (error) => {
      console.error(error);
      showToast('Unable to retrieve your location.');
      updateStatus('Geolocation request denied or failed.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function initEvents() {
  addressButton.addEventListener('click', () => {
    toggleAddressInput();
    updateStatus('Address search toggled.');
  });

  currentButton.addEventListener('click', () => {
    try {
      centerOnCurrentLocation();
    } catch (error) {
      console.error(error);
      showToast('An unexpected error occurred using geolocation.');
    }
  });

  defaultButton.addEventListener('click', () => {
    try {
      centerOnDefault();
    } catch (error) {
      console.error(error);
      showToast('Unable to reset the map view.');
    }
  });

  addressInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      try {
        handleGeocode(addressInput.value.trim());
      } catch (error) {
        console.error(error);
        showToast('An unexpected error occurred while geocoding.');
      }
    } else if (event.key === 'Escape') {
      addressInput.hidden = true;
    }
  });
}

function initializeMap() {
  if (!token) {
    tokenBanner.hidden = false;
    updateStatus('Mapbox token missing. Map not initialized.');
    return;
  }

  tokenBanner.hidden = true;
  mapboxgl.accessToken = token;

  try {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      updateStatus('Map loaded.');
    });
  } catch (error) {
    console.error(error);
    showToast('Failed to initialize the map.');
    updateStatus('Map initialization failed.');
  }
}

if (!token) {
  tokenBanner.hidden = false;
} else {
  tokenBanner.hidden = true;
}

initEvents();
initializeMap();

