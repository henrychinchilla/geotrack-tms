// Lógica de Alerta de Auditoría GPS
export const checkLocationViolation = (vendedorPos: any, clientePos: any, vendedorName: string) => {
  const distance = calculateDistance(vendedorPos, clientePos); // Función Haversine
  
  if (distance > 100) { // Umbral de 100 metros definido por Henry
    const alertMsg = `🚩 AVISO: ${vendedorName} completó una visita fuera de rango (${distance}m de desviación).`;
    
    sendPushNotification("admin_group", "Violación de Geo-cerca", alertMsg);
  }
}
