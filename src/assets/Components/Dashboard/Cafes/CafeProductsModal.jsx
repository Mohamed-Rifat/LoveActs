import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useToken } from '../../../Context/TokenContext/TokenContext';

const CafeProductsModal = ({ cafe, isOpen, onClose, onUpdateProduct }) => {
  const [editingProduct, setEditingProduct] = useState(null);
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
      const response = await api.patch(
        `/cafe/update-cafe-products/${cafe._id}/${editingProduct._id}`,
        {
          productName: editForm.productName.trim(),
          price: editForm.price,
        }
      );

      console.log('✅ Product updated:', response.data);
      showToast('Product updated successfully!');

      setEditingProduct(null);
      setEditForm({ productName: '', price: '' });

      if (onUpdateProduct) {
        await onUpdateProduct();
      }
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
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[60] transform transition-all duration-300 ${
          toast.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        } ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="flex items-center gap-2">
            {toast.type === 'error' ? '❌' : '✅'}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        
        <div 
          ref={modalRef}
          className={`relative bg-white w-full max-w-3xl mx-auto p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
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
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              name="productName"
                              value={editForm.productName}
                              onChange={handleEditChange}
                              placeholder="Product Name"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-transparent transition ${
                                errors.productName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={updating}
                            />
                            {errors.productName && (
                              <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="number"
                              name="price"
                              value={editForm.price}
                              onChange={handleEditChange}
                              placeholder="Price"
                              min="0"
                              step="1"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-transparent transition ${
                                errors.price ? 'border-red-500' : 'border-gray-300'
                              }`}
                              disabled={updating}
                            />
                            {errors.price && (
                              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            disabled={updating}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={updating}
                            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2"
                          >
                            {updating ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
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
                        <p className="text-sm text-gray-500"> {product.price} LE</p>
                      </>
                    )}
                  </div>

                  {(!editingProduct || editingProduct._id !== product._id) && (
                    <button
                      onClick={() => handleEditClick(product)}
                      disabled={globalLoading}
                      className="text-indigo-600 hover:text-indigo-800 p-3 transition  disabled:opacity-50 flex-shrink-0"
                      title="Edit Product"
                    >
                      <span className="text-md">✎</span>
                    </button>
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
                    className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.productName ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
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