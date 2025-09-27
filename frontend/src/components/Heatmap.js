// frontend/src/components/Heatmap.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

function Heatmap({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 18,
      // --- THIS IS THE NEW LINE ---
      gradient: { 0.4: 'orange', 0.8: 'red', 1.0: '#800000' } // Orange to dark red gradient
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default Heatmap;