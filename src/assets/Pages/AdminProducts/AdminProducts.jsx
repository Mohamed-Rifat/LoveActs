'use client'
import React, { useState, useEffect } from 'react';
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

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api/product';

// API Functions
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const { data } = await axios.get(`${API_BASE_URL}/all-products`, {
      headers: {
        'Authorization': `Admin ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

const createProduct = async (productData) => {
  const { data } = await axios.post(`${API_BASE_URL}/create`, productData, {
    headers: {
      'Authorization': `Admin ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return data;
};

const updateProduct = async ({ id, productData }) => {
  const { data } = await axios.put(`${API_BASE_URL}/update/${id}`, productData, {
    headers: {
      'Authorization': `Admin ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return data;
};

const softDeleteProduct = async (id) => {
  await axios.patch(`${API_BASE_URL}/${id}/soft-delete`, {}, {
    headers: {
      'Authorization': `Admin ${localStorage.getItem('token')}`
    }
  });
};

const hardDeleteProduct = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      'Authorization': `Admin ${localStorage.getItem('token')}`
    }
  });
};

const AdminProducts = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSoftDeleteDialog, setOpenSoftDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    isActive: true,
    isFeatured: false
  });

  const queryClient = useQueryClient();

  // Fetch products data
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
    onError: (err) => {
      console.error("Error details:", err);
      toast.error(err.message);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  });

  // Delete mutations
  const { mutate: softDeleteMutation, isPending: isSoftDeleting } = useMutation({
    mutationFn: softDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product soft deleted successfully');
      setOpenSoftDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to soft delete product');
    }
  });

  const { mutate: hardDeleteMutation, isPending: isHardDeleting } = useMutation({
    mutationFn: hardDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product permanently deleted');
      setOpenDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete product');
    }
  });

  // Create product mutation
  const { mutate: createProductMutation, isPending: isCreating } = useMutation({
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

  // Update product mutation
  const { mutate: updateProductMutation, isPending: isUpdating } = useMutation({
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
      price: 0,
      category: '',
      stock: 0,
      isActive: true,
      isFeatured: false
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e, isEdit = false) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    if (isEdit && selectedProduct) {
      updateProductMutation({ id: selectedProduct._id, productData: submissionData });
    } else {
      createProductMutation(submissionData);
    }
  };

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter(product => {
      const search = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(search) ||
        (product.category && product.category.toLowerCase().includes(search)) ||
        (product.description && product.description.toLowerCase().includes(search))
      );
    });
  }, [products, searchTerm]);

  // Stats calculation
  const stats = React.useMemo(() => {
    return {
      total: products.length,
      active: products.filter(p => p.isActive).length,
      featured: products.filter(p => p.isFeatured).length,
      outOfStock: products.filter(p => p.stock <= 0).length
    };
  }, [products]);

  // Drawer items
  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Cafes', icon: <CafeIcon /> },
    { text: 'Products', icon: <ProductsIcon />, active: true },
    { text: 'Users', icon: <UsersIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-amber-600 text-white">
            <h2 className="text-xl font-bold">Love Acts</h2>
          </div>
          <div className="border-b border-gray-200"></div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-4">
              {drawerItems.map((item) => (
                <li
                  key={item.text}
                  className={`px-4 py-3 mx-2 rounded-md flex items-center ${item.active ? 'bg-amber-100 text-amber-800' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              <LogoutIcon className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* App Bar */}
        <header className="bg-white shadow-sm z-20">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="search-input"
                  name="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
            <p className="text-gray-600">Manage all products in your system</p>
          </div>

          {/* Stats Cards */}
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

          {/* Actions Bar */}
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
              onClick={() => setOpenAddDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <AddIcon className="mr-2" />
              Add New Product
            </button>
          </div>

          {/* Products Table */}
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
                          description: product.description,
                          price: product.price,
                          category: product.category,
                          stock: product.stock,
                          isActive: Boolean(product.isActive),
                          isFeatured: Boolean(product.isFeatured)
                        });
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
                        Soft Delete
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

      {/* Delete Confirmation Dialogs */}
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
                  onClick={() => hardDeleteMutation(selectedProduct._id)}
                  disabled={isHardDeleting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isHardDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isHardDeleting ? 'Deleting...' : 'Delete Permanently'}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Soft Delete Product</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to soft delete "{selectedProduct?.name}"? The product will be marked as inactive but can be restored later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => softDeleteMutation(selectedProduct._id)}
                  disabled={isSoftDeleting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm ${isSoftDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSoftDeleting ? 'Processing...' : 'Soft Delete'}
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

      {/* Edit Product Dialog */}
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                    disabled={isUpdating}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
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

      {/* Add Product Dialog */}
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
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
                    disabled={isCreating}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm ${isCreating ? 'opacity-70 cursor-not-allowed' : ''}`}
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

export default AdminProducts;