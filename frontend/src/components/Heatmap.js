// frontend/src/components/Heatmap.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat'; // Import the vanilla JS library
import L from 'leaflet';

function Heatmap({ points }) {
  const map = useMap(); // This hook gives us the map instance

  useEffect(() => {
    if (!map || points.length === 0) {
        return; // Don't do anything if map is not ready or there are no points
    }

    // Create the heat layer with our points and some configuration
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 18,
    });

    // Add the layer to the map
    heatLayer.addTo(map);

    // This is a cleanup function that React will run when the component is removed
    // This is crucial to prevent old heatmaps from staying on the map
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]); // This effect will re-run if the map or points change

  return null; // This component doesn't render any visible HTML itself
}

export default Heatmap;