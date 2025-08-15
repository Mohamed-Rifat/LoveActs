'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalCafe as CafeIcon,
  ShoppingBag as ProductsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Star as StarIcon,
  CheckCircle as ActiveIcon,
  Visibility as FeaturedIcon,
  Schedule as NewIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { Switch } from '@mui/material';

const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api/product';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');

  return {
    Authorization: `Admin ${token}`,
    ...(!isFormData && { 'Content-Type': 'application/json' })
  };
};

const fetchProducts = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/`, {
      headers: getAuthHeaders()
    });

    const productsData = Array.isArray(data) ? data : data?.products || data?.data || [];

    return productsData.map((product) => ({
      ...product,
      price: parseFloat(product.price || 0),
      stock: parseInt(product.stock || 0),
      isActive: product.isActive === true || product.isActive === 'true',
      isFeatured: product.isFeatured === true || product.isFeatured === 'true'
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

const createProduct = async (productData) => {
  try {
    const isFormData = productData?.image instanceof File;
    const headers = getAuthHeaders(isFormData);

    if (!productData.name || !productData.price || !productData.stock || !productData.category) {
      throw new Error('Missing required fields');
    }

    if (isFormData) {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      const { data } = await axios.post(`${API_BASE_URL}/`, formData, { headers });
      return data;
    } else {
      const { data } = await axios.post(`${API_BASE_URL}/`, productData, { headers });
      return data;
    }
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

const updateProduct = async ({ id, productData }) => {
  try {
    const isFormData = productData?.image instanceof File;

    if (isFormData) {
      const headers = getAuthHeaders(true);
      const formData = new FormData();
      Object.entries(productData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v);
      });
      const { data } = await axios.put(`${API_BASE_URL}/${id}`, formData, { headers });
      return data;
    } else {
      const headers = getAuthHeaders(false);
      const { data } = await axios.put(`${API_BASE_URL}/${id}`, productData, { headers });
      return data;
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

const softDeleteProduct = async (id) => {
  try {
    await axios.patch(
      `${API_BASE_URL}/${id}/soft-delete`,
      {},
      {
        headers: getAuthHeaders()
      }
    );
  } catch (error) {
    console.error('Error soft deleting product:', error);
    throw new Error(error.response?.data?.message || 'Failed to soft delete product');
  }
};

const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

const DashboardProducts = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSoftDeleteDialog, setOpenSoftDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null,
    isActive: true,
    isFeatured: false
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = () => {
      if (anchorEl) setAnchorEl(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [anchorEl]);

  const handleValidation = (e) => {
    const { name, value, type, required } = e.target;
    const trimmed = typeof value === 'string' ? value.trim() : value;
    const newErrors = { ...errors };

    delete newErrors[name];

    if (required && (trimmed === '' || trimmed === null || trimmed === undefined)) {
      newErrors[name] = 'This field is required';
    } else {
      switch (name) {
        case 'price': {
          const num = Number(trimmed);
          if (Number.isNaN(num)) newErrors.price = 'Price must be a number';
          else if (num < 0) newErrors.price = 'Price cannot be negative';
          break;
        }
        case 'stock': {
          const num = Number(trimmed);
          if (Number.isNaN(num)) newErrors.stock = 'Stock must be a number';
          else if (num < 0) newErrors.stock = 'Stock cannot be negative';
          break;
        }
        case 'name': {
          if ((trimmed || '').length < 3) newErrors.name = 'Name must be at least 3 characters';
          break;
        }
        case 'category': {
          if ((trimmed || '').length < 2) newErrors.category = 'Category must be at least 2 characters';
          break;
        }
        default:
          break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    else if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    else if (formData.category.trim().length < 2) newErrors.category = 'Category must be at least 2 characters';
    
    if (formData.price === '') newErrors.price = 'Price is required';
    else {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum)) newErrors.price = 'Price must be a number';
      else if (priceNum < 0) newErrors.price = 'Price cannot be negative';
    }
    
    if (formData.stock === '') newErrors.stock = 'Stock is required';
    else {
      const stockNum = Number(formData.stock);
      if (isNaN(stockNum)) newErrors.stock = 'Stock must be a number';
      else if (stockNum < 0) newErrors.stock = 'Stock cannot be negative';
      else if (!Number.isInteger(stockNum)) newErrors.stock = 'Stock must be a whole number';
    }
    
    if (!openEditDialog && !formData.image) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData(prev => ({ ...prev, image: null }));
      setImagePreview(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; 

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF)');
      return;
    }

    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  };

  const {
    data: products = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
    onError: (err) => {
      console.error('Error details:', err);
      toast.error(err.message);
    }
  });

  const { mutate: softDeleteMutation, isPending: isSoftDeleting } = useMutation({
    mutationFn: softDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deactivated successfully');
      setOpenSoftDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to deactivate product');
    }
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted permanently');
      setOpenDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete product');
    }
  });

  const { mutate: createMutation, isPending: isCreating } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product created successfully');
      setOpenAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create product');
    }
  });

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product updated successfully');
      setOpenEditDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update product');
    }
  });


  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: null,
      isActive: true,
      isFeatured: false
    });
    setImagePreview(null);
    setErrors({});
  };

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

  const handleMenuOpen = (event, product) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleSoftDeleteClick = () => {
    setOpenSoftDeleteDialog(true);
    handleMenuClose();
  };

  const handleEditClick = () => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name ?? '',
        description: selectedProduct.description ?? '',
        price: selectedProduct.price ?? '',
        category: selectedProduct.category ?? '',
        stock: selectedProduct.stock ?? '',
        image: null, 
        isActive: Boolean(selectedProduct.isActive),
        isFeatured: Boolean(selectedProduct.isFeatured)
      });
      setImagePreview(selectedProduct.imageUrl || null);
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };

  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProduct?._id) return;
    deleteMutation(selectedProduct._id);
  };

  const handleSoftDeleteConfirm = () => {
    if (!selectedProduct?._id) return;
    softDeleteMutation(selectedProduct._id);
  };

   const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (['price', 'stock'].includes(name)) {
      const numValue = newValue === '' ? '' : Number(newValue);
      if (isNaN(numValue)) {
        setErrors(prev => ({ ...prev, [name]: 'Must be a number' }));
      } else if (numValue < 0) {
        setErrors(prev => ({ ...prev, [name]: 'Cannot be negative' }));
      } else if (name === 'stock' && !Number.isInteger(numValue)) {
        setErrors(prev => ({ ...prev, [name]: 'Must be a whole number' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (e, isEdit = false) => {
    e.preventDefault();

    const priceNum = formData.price === '' ? '' : Number(formData.price);
    const stockNum = formData.stock === '' ? '' : Number(formData.stock);

    const submissionData = {
      ...formData,
      price: priceNum,
      stock: stockNum
    };

    const fakeEvent = { target: { name: 'name', value: submissionData.name, required: true } };
    const fakeEvent2 = { target: { name: 'price', value: submissionData.price, required: true } };
    const fakeEvent3 = { target: { name: 'category', value: submissionData.category, required: true } };

    const ok1 = handleValidation(fakeEvent);
    const ok2 = handleValidation(fakeEvent2);
    const ok3 = handleValidation(fakeEvent3);

    if (!(ok1 && ok2 && ok3)) {
      toast.error('Please fix validation errors');
      return;
    }

    if (isEdit && selectedProduct?._id) {
      updateMutation({ id: selectedProduct._id, productData: submissionData });
    } else {
      createMutation(submissionData);
    }
  };

  const filteredProducts = useMemo(() => {
    const search = (searchTerm || '').toLowerCase();
    return (products || []).filter((product) => {
      const name = (product.name || '').toLowerCase();
      const cat = (product.category || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      return name.includes(search) || cat.includes(search) || desc.includes(search);
    });
  }, [products, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((p) => p.isActive).length,
      featured: products.filter((p) => p.isFeatured).length,
      outOfStock: products.filter((p) => Number(p.stock) <= 0).length
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
    
      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
            <p className="text-gray-600">Manage all products in your system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <ProductsIcon />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-800">{isLoading ? '...' : stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <ActiveIcon />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Products</p>
                  <p className="text-2xl font-semibold text-gray-800">{isLoading ? '...' : stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FeaturedIcon />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Featured Products</p>
                  <p className="text-2xl font-semibold text-gray-800">{isLoading ? '...' : stats.featured}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <InventoryIcon />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-semibold text-gray-800">{isLoading ? '...' : stats.outOfStock}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
              </div>
              <input
                type="text"
                id="search-input-2"
                name="search2"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <AddIcon className="mr-2" />
              Add New Product
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">
              Error loading products: {error.message}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? "We couldn't find any products matching your search. Try different keywords."
                  : "There are currently no products available. Please check back later."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                >
                  {product.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                        {product.name}
                      </h2>
                      <div className="flex space-x-2">
                        {product.isFeatured && (
                          <span className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            <StarIcon className="mr-1" fontSize="small" /> Featured
                          </span>
                        )}
                        <span className={`flex items-center text-xs px-2 py-1 rounded-full ${product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-start">
                        <CategoryIcon className="flex-shrink-0 mt-1 mr-2 text-gray-400" fontSize="small" />
                        <p className="text-sm">{product.category || "No category specified"}</p>
                      </div>

                      <div className="flex items-start">
                        <PriceIcon className="flex-shrink-0 mt-1 mr-2 text-gray-400" fontSize="small" />
                        <p className="text-sm">${product.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-start">
                        <InventoryIcon className="flex-shrink-0 mt-1 mr-2 text-gray-400" fontSize="small" />
                        <p className={`text-sm ${product.stock <= 0 ? 'text-red-500' : ''}`}>
                          {product.stock <= 0 ? 'Out of Stock' : `In Stock: ${product.stock}`}
                        </p>
                      </div>

                      {product.description && (
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setFormData({
                          name: product.name,
                          description: product.description || '',
                          price: product.price,
                          category: product.category,
                          stock: product.stock,
                          image: null,
                          isActive: Boolean(product.isActive),
                          isFeatured: Boolean(product.isFeatured)
                        });
                        setImagePreview(product.imageUrl || null);
                        setSelectedProduct(product);
                        setOpenEditDialog(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenSoftDeleteDialog(true);
                        }}
                        className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors"
                      >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {openDeleteDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DeleteIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to permanently delete "{selectedProduct?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenDeleteDialog(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openSoftDeleteDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DeleteIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedProduct?.isActive ? 'Deactivate' : 'Activate'} Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedProduct?.isActive 
                          ? `Are you sure you want to deactivate "${selectedProduct?.name}"? The product will be hidden but can be reactivated later.`
                          : `Are you sure you want to activate "${selectedProduct?.name}"? The product will be visible to customers.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSoftDeleteConfirm}
                  disabled={isSoftDeleting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm ${isSoftDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSoftDeleting ? 'Processing...' : selectedProduct?.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenSoftDeleteDialog(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openEditDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={(e) => handleSubmit(e, true)}>
                <div className="bg-amber-600 px-4 py-3">
                  <h3 className="text-lg font-medium text-white">Edit Product</h3>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="edit-name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="edit-description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="edit-price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        id="edit-stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.stock ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="edit-category"
                        value={formData.category}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Product Image
                      </label>
                      <div className="mt-1 flex items-center">
                        <label
                          htmlFor="edit-product-image"
                          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                          Change Image
                        </label>
                        <input
                          id="edit-product-image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="ml-4 h-12 w-12 rounded-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="flex items-center">
                        <Switch
                          name="isActive"
                          id="edit-isActive"
                          checked={Boolean(formData.isActive)}
                          onChange={handleInputChange}
                          color="warning"
                        />
                        <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-700">
                          Active
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="flex items-center">
                        <Switch
                          name="isFeatured"
                          id="edit-isFeatured"
                          checked={Boolean(formData.isFeatured)}
                          onChange={handleInputChange}
                          color="warning"
                        />
                        <label htmlFor="edit-isFeatured" className="ml-2 block text-sm text-gray-700">
                          Featured
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isUpdating || Object.keys(errors).length > 0}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm ${isUpdating || Object.keys(errors).length > 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenEditDialog(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {openAddDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-amber-600 px-4 py-3">
                  <h3 className="text-lg font-medium text-white">Add New Product</h3>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="add-name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="add-name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="add-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="add-description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="add-price" className="block text-sm font-medium text-gray-700">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="add-price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="add-stock" className="block text-sm font-medium text-gray-700">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        id="add-stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.stock ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="add-category" className="block text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="add-category"
                        value={formData.category}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                      />
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Product Image <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 flex items-center">
                        <label
                          htmlFor="add-product-image"
                          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                          Choose Image
                        </label>
                        <input
                          id="add-product-image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                          required
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="ml-4 h-12 w-12 rounded-full object-cover"
                          />
                        )}
                      </div>
                      {!imagePreview && (
                        <p className="mt-1 text-sm text-red-600">Product image is required</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <div className="flex items-center">
                        <Switch
                          name="isActive"
                          id="add-isActive"
                          checked={Boolean(formData.isActive)}
                          onChange={handleInputChange}
                          color="warning"
                        />
                        <label htmlFor="add-isActive" className="ml-2 block text-sm text-gray-700">
                          Active
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="flex items-center">
                        <Switch
                          name="isFeatured"
                          id="add-isFeatured"
                          checked={Boolean(formData.isFeatured)}
                          onChange={handleInputChange}
                          color="warning"
                        />
                        <label htmlFor="add-isFeatured" className="ml-2 block text-sm text-gray-700">
                          Featured
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isCreating || Object.keys(errors).length > 0 || !imagePreview}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm ${isCreating || Object.keys(errors).length > 0 || !imagePreview ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isCreating ? 'Creating...' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenAddDialog(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProducts;