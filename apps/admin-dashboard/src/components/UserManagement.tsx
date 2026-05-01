import React, { useState } from 'react';
import { UserPlus, Shield, Smartphone, Truck } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Carlos Ruíz', role: 'repartidor', status: 'activo' },
    { id: 2, name: 'Ana Coloch', role: 'vendedor', status: 'activo' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestión de Personal</h2>
          <p className="text-sm text-slate-500">Administra los roles y accesos de tu equipo</p>
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Rol / Perfil</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-slate-700">{user.name}</td>
                <td className="p-4">
                  <span className="flex items-center text-sm">
                    {user.role === 'repartidor' ? (
                      <Truck className="w-4 h-4 mr-2 text-orange-500" />
                    ) : (
                      <Smartphone className="w-4 h-4 mr-2 text-blue-500" />
                    )}
                    <span className="capitalize">{user.role}</span>
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-slate-400 hover:text-red-600 mx-2 text-xs font-semibold">
                    Suspender
                  </button>
                  <button className="text-slate-400 hover:text-blue-600 mx-2 text-xs font-semibold">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;