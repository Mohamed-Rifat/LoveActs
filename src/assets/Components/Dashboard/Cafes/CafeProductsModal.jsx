import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useToken } from '../../../Context/TokenContext/TokenContext';

const CafeProductsModal = ({ cafe, isOpen, onClose, onUpdateProduct }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editForm, setEditForm] = useState({ productName: '', price: '' });
  const [newProduct, setNewProduct] = useState({ productName: '', price: '', image: null });
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { token } = useToken();

  const modalRef = useRef(null);
  const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api';

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Admin ${token}`,
    },
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (editingProduct) {
      setEditForm({
        productName: editingProduct.productName,
        price: editingProduct.price,
      });
      setEditImage(null);
      setErrors({});
    }
  }, [editingProduct]);

  const validateForm = (formData, isEdit = false) => {
    const newErrors = {};

    if (!formData.productName?.trim()) {
      newErrors.productName = 'Product name is required';
    } else if (formData.productName.trim().length < 2) {
      newErrors.productName = 'Product name must be at least 2 characters';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setErrors({});
  };

  const handleDeleteProduct = async (productId) => {
    if (!cafe?._id) {
      showToast('Cafe not found', 'error');
      return;
    }

    setGlobalLoading(true);

    try {
      const response = await api.delete(
        `/cafe/remove-product-from-cafe/${cafe._id}/${productId}`
      );

      showToast('Product deleted successfully!');

      if (onUpdateProduct) {
        await onUpdateProduct();
      }

    } catch (error) {
      console.error('❌ Error deleting product:', error.response || error);
      showToast('Failed to delete product', 'error');
    } finally {
      setGlobalLoading(false);
    }
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct || !cafe) return;

    if (!validateForm(editForm, true)) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    setUpdating(true);
    setGlobalLoading(true);

    try {
      const formData = new FormData();
      formData.append('productName', editForm.productName.trim());
      formData.append('price', editForm.price);

      if (editImage) {
        formData.append('image', editImage);
      }

      const response = await api.patch(
        `/cafe/update-cafe-products/${cafe._id}/${editingProduct._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      showToast('Product updated successfully!');

      setEditingProduct(null);
      setEditForm({ productName: '', price: '' });
      setEditImage(null);
      if (onUpdateProduct) await onUpdateProduct();

    } catch (error) {
      console.error('❌ Error updating product:', error.response || error);
      showToast('Failed to update product', 'error');
    } finally {
      setUpdating(false);
      setGlobalLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ productName: '', price: '' });
    setErrors({});
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!cafe?._id) {
      showToast('Cafe not found', 'error');
      return;
    }

    if (!validateForm(newProduct)) {
      showToast('Please fix the form errors', 'error');
      return;
    }

    setAdding(true);
    setGlobalLoading(true);

    const formData = new FormData();
    formData.append('productName', newProduct.productName.trim());
    formData.append('price', newProduct.price);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      const response = await api.patch(
        `/cafe/add-product-to-cafe/${cafe._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      showToast('Product added successfully!');
      console.log('Response:', response.data);

      setNewProduct({ productName: '', price: '', image: null });
      setErrors({});

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      if (onUpdateProduct) {
        await onUpdateProduct();
      }
    } catch (error) {
      console.error('❌ Error adding product:', error.response || error);
      showToast('Failed to add product', 'error');
    } finally {
      setAdding(false);
      setGlobalLoading(false);
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value, files } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[60] transform transition-all duration-300 ${toast.type === 'error'
          ? 'bg-red-500 text-white'
          : 'bg-green-500 text-white'
          } ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex items-center gap-2">
            {toast.type === 'error' ? '❌' : '✅'}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>

        <div
          ref={modalRef}
          className={`relative bg-white w-full max-w-3xl mx-auto p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >

          {globalLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-10">
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="text-gray-700">Processing...</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center border-b pb-3 mb-4 sticky top-0 bg-white z-1">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Products of {cafe?.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition duration-200"
              disabled={globalLoading}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {cafe?.products && cafe.products.length > 0 ? (
              cafe.products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 bg-gray-50 border border-gray-200  p-4 hover:shadow-sm transition-all duration-300 "
                >
                  <div className=" w-20 h-20 rounded-full overflow-hidden bg-gray-100 border flex-shrink-0">
                    <img
                      src={product.image || "/Logo.PNG"}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/Logo.PNG";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingProduct && editingProduct._id === product._id ? (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          <div className="lg:col-span-2 space-y-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Name
                              </label>
                              <input
                                type="text"
                                name="productName"
                                value={editForm.productName}
                                onChange={handleEditChange}
                                placeholder="Enter product name"
                                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.productName
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                  } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
                                disabled={updating}
                              />
                              {errors.productName && (
                                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.productName}
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name="price"
                                  value={editForm.price}
                                  onChange={handleEditChange}
                                  placeholder="0.00"
                                  min="0"
                                  step="1"
                                  className={`w-full px-4 py-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.price
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-300 hover:border-gray-400'
                                    } ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  disabled={updating}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 font-medium">LE</span>
                                </div>
                              </div>
                              {errors.price && (
                                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.price}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">
                              Product Image
                            </label>

                            <div className="bg-white border border-gray-200 rounded-md p-4">
                              <div className="flex flex-col items-center space-y-4">
                                <label className={`w-full text-center px-4 py-3 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 ${updating
                                    ? 'opacity-60 cursor-not-allowed bg-gray-100 border-gray-300'
                                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                  }`}>
                                  <div className="space-y-2">
                                    <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <div className="text-sm text-gray-600">
                                      <span className="font-medium text-blue-600">Click to upload</span>
                                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditImage(e.target.files[0])}
                                    className="hidden"
                                    disabled={updating}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={cancelEdit}
                            disabled={updating}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={updating}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2"
                          >
                            {updating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {product.productName}
                        </h4>
                        <p className="text-gray-600">{product.price} LE</p>
                      </>
                    )}
                  </div>

                  {(!editingProduct || editingProduct._id !== product._id) && (
                    <div className="flex items-center gap-1 opacity-100  transition-opacity">
                      <button
                        onClick={() => handleEditClick(product)}
                        disabled={globalLoading}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={globalLoading}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed bg-gray-50">
                <p className="text-lg">No products found for this cafe.</p>
                <p className="text-sm mt-1">Add your first product below!</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border border-gray-200">
            <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              Add New Product
            </h4>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={newProduct.productName}
                    onChange={handleNewProductChange}
                    className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.productName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    required
                    disabled={adding}
                  />
                  {errors.productName && (
                    <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    required
                    disabled={adding}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleNewProductChange}
                    className="w-full border px-3 py-2 rounded-lg file:mr-3 file:px-4 file:py-2 file:bg-green-100 file:border-0 file:rounded-md file:text-green-700 hover:file:bg-green-200 transition cursor-pointer disabled:opacity-50"
                    disabled={adding}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={adding}
                  className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2 shadow-lg hover:shadow-xl "
                >
                  {adding ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <span>+</span>
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={globalLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CafeProductsModal;