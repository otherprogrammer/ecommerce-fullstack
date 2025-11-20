import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as couponsService from '../services/coupons';

const CouponAdmin = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    active: true,
    valid_from: '',
    valid_until: '',
    minimum_amount: '0',
    usage_limit: '-1'
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponsService.getCoupons();
      setCoupons(data);
      setError('');
    } catch (err) {
      setError(err.detail || 'Error al cargar cupones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        minimum_amount: parseFloat(formData.minimum_amount),
        usage_limit: parseInt(formData.usage_limit),
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null
      };

      if (editingCoupon) {
        await couponsService.updateCoupon(editingCoupon.id, couponData);
        setSuccess('Cupón actualizado exitosamente');
      } else {
        await couponsService.createCoupon(couponData);
        setSuccess('Cupón creado exitosamente');
      }
      setShowModal(false);
      resetForm();
      fetchCoupons();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.detail || err.code?.[0] || 'Error al guardar cupón');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      active: coupon.active,
      valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 16) : '',
      valid_until: coupon.valid_until ? coupon.valid_until.slice(0, 16) : '',
      minimum_amount: coupon.minimum_amount.toString(),
      usage_limit: coupon.usage_limit.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cupón?')) return;
    try {
      await couponsService.deleteCoupon(id);
      setSuccess('Cupón eliminado exitosamente');
      fetchCoupons();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.detail || 'Error al eliminar cupón');
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      active: true,
      valid_from: '',
      valid_until: '',
      minimum_amount: '0',
      usage_limit: '-1'
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || !user.is_staff) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mt-8">
        <p className="text-xl font-semibold">Acceso denegado. Solo administradores pueden ver esta página.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-8 text-lg">Cargando cupones...</div>;
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-heading font-bold">Administrar Cupones</h2>
        <button
          onClick={openCreateModal}
          className="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          + Nuevo Cupón
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Valor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Min. Compra</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Usos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Válido Hasta</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No hay cupones. Crea el primero.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-bold text-gray-900">{coupon.code}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {coupon.discount_type === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `S/.${coupon.discount_value}`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">S/.{coupon.minimum_amount}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {coupon.usage_limit === -1 ? 'Ilimitado' : `${coupon.used_count}/${coupon.usage_limit}`}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coupon.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{formatDate(coupon.valid_until)}</td>
                  <td className="px-4 py-4 text-sm text-right space-x-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Código del Cupón *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VERANO2025"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Tipo de Descuento *</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed_amount">Monto Fijo (S/.)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Valor del Descuento * {formData.discount_type === 'percentage' ? '(%)' : '(S/.)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Compra Mínima (S/.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minimum_amount}
                    onChange={(e) => setFormData({ ...formData, minimum_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Límite de Usos (-1 = Ilimitado)</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="mr-2 w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium">Cupón Activo</span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Válido Desde</label>
                  <input
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Válido Hasta</label>
                  <input
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600"
                >
                  {editingCoupon ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponAdmin;
