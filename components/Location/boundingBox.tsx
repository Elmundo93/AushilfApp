


export function getBoundingBox(latitude: number, longitude: number, radiusInKm: number) {
    const earthRadius = 6371; // Erdradius in Kilometern
  
    const maxLat = latitude + (radiusInKm / earthRadius) * (180 / Math.PI);
    const minLat = latitude - (radiusInKm / earthRadius) * (180 / Math.PI);
  
    const maxLon = longitude + (radiusInKm / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
    const minLon = longitude - (radiusInKm / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
  
        return { minLat, maxLat, minLon, maxLon };
  }