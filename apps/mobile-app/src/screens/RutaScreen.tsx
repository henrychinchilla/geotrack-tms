const handleCierreJornada = async () => {
  const confirmacion = await Alert.confirm("¿Deseas finalizar tu jornada?");
  
  if (confirmacion) {
    const { data, error } = await supabase.rpc('finalizar_ruta_diaria', {
      p_vendedor_id: user.id,
      p_km_finales: currentAccumulatedKm,
      p_lat_cierre: lastLat,
      p_lng_cierre: lastLng
    });

    if (!error) {
      // Detenemos el GPS en segundo plano
      stopBackgroundTracking();
      alert("Jornada cerrada con éxito. ¡Buen descanso!");
    }
  }
};
