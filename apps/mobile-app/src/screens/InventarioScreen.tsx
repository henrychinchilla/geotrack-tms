// Componente rápido para mostrar el stock del camión actual
const StockList = ({ inventory }: any) => (
  <View className="p-4">
    <Text className="text-xl font-bold mb-4">Mi Inventario (Camión)</Text>
    {inventory.map((item: any) => (
      <View key={item.id} className="flex-row justify-between border-b border-gray-100 py-3">
        <View>
          <Text className="font-semibold text-slate-700">{item.products.name}</Text>
          <Text className="text-xs text-gray-500">SKU: {item.products.sku}</Text>
        </View>
        <Text className={`font-bold ${item.quantity < 5 ? 'text-red-500' : 'text-green-600'}`}>
          {item.quantity} {item.products.unit_measure}
        </Text>
      </View>
    ))}
  </View>
);
