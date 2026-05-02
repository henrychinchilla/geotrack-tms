  // Reemplaza estas dos funciones en tu archivo de Viajes
  const abrirGoogleMaps = (lat: number, lng: number) => {
    if (!lat || !lng) return alert('Coordenadas no disponibles.');
    // URL oficial de Google Maps corregida
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const abrirWaze = (lat: number, lng: number) => {
    if (!lat || !lng) return alert('Coordenadas no disponibles.');
    // URL de Waze validada
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
  };
