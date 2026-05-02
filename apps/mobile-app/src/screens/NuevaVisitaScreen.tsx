import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import * as Location from 'expo-location';

export const NuevaVisitaScreen = ({ route, navigation }: any) => {
  // Recibimos el ID del cliente si viene desde el mapa
  const { clienteId, nitInicial, nombreNegocio } = route.params;
  
  const [nit, setNit] = useState(nitInicial || '');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);

  const registrarVisita = async () => {
    setLoading(true);
    
    // 1. Obtener ubicación exacta en el momento del registro
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // 2. Insertar la visita en la tabla que ya creamos
    const { data, error } = await supabase
      .from('sales_visits')
      .insert([
        {
          customer_id: clienteId,
          vendedor_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'completed', // Aquí es donde cambia a Verde
          execution_location: `POINT(${longitude} ${latitude})`,
          notes: notas,
          completed_at: new Date().toISOString()
        }
      ]);

    if (error) {
      Alert.alert("Error", "No se pudo registrar la visita: " + error.message);
    } else {
      Alert.alert("Éxito", "Visita registrada y punto actualizado a verde.");
      navigation.goBack(); // Regresa al mapa
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Registrar Visita
      </Text>
      <Text style={{ color: '#666', marginBottom: 20 }}>
        Negocio: {nombreNegocio}
      </Text>

      <Text style={{ fontWeight: '600' }}>Confirmar NIT / DPI:</Text>
      <TextInput
        value={nit}
        onChangeText={setNit}
        placeholder="Ingrese NIT"
        style={{ borderBottomWidth: 1, marginBottom: 20, padding: 8 }}
        editable={false} // El NIT ya viene del cliente seleccionado
      />

      <Text style={{ fontWeight: '600' }}>Notas de la visita:</Text>
      <TextInput
        value={notas}
        onChangeText={setNotas}
        placeholder="Ej. Se dejó pedido, el cliente no estaba, etc."
        multiline
        numberOfLines={4}
        style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginTop: 10, height: 100 }}
      />

      <TouchableOpacity
        onPress={registrarVisita}
        disabled={loading}
        style={{
          backgroundColor: '#22C55E', // Verde GeoTrack
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 30
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          {loading ? "Procesando..." : "COMPLETAR VISITA"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
                
