'use client'
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalCafe as CafeIcon,
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
  LocationOn as MapPinIcon,
  Home as HomeIcon,
  AccessTime as ClockIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon
} from '@mui/icons-material';
import { Switch } from '@mui/material';

const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api/cafe';

const fetchCafes = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const { data } = await axios.get(`${API_BASE_URL}/display-all-cafes`, {
      headers: {
        'Authorization': `Admin ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const cafesData = Array.isArray(data) ? data : data?.cafeData || data?.data || data?.cafes || [];

    return cafesData.map(cafe => ({
      ...cafe,
      isActive: cafe.isActive === true || cafe.isActive === 'true',
      isFeatured: cafe.isFeatured === true || cafe.isFeatured === 'true'
    }));

  } catch (error) {
    console.error('Error fetching cafes:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cafes');
  }
};

const createCafe = async (cafeData) => {
  const { data } = await axios.post(`${API_BASE_URL}/add-cafe`, cafeData, {
    headers: {
      'Authorization': `Admin ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return data;
};

const updateCafe = async ({ id, cafeData }) => {
  const { data } = await axios.put(`${API_BASE_URL}/update-cafe/${id}`, cafeData, {
    headers: {
      'Authorization': `Admin ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return data;
};

const deleteCafe = async (id) => {
  await axios.delete(`${API_BASE_URL}/delete-cafe/${id}`, {
    headers: {
      'Authorization': `Admin ${localStorage.getItem('token')}`
    }
  });
};

const DashboardCafes = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    iframe: '',
    link: '',
    location: '',
    isActive: true,
    isFeatured: false
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = () => {
      if (anchorEl) {
        setAnchorEl(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [anchorEl]);

  const handleValidation = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    delete newErrors[name];

    if (!value.trim() && e.target.required) {
      newErrors[name] = 'This field is required';
    } else {
      switch (name) {
        case 'phone':
          if (!/^[0-9]{8,15}$/.test(value)) {
            newErrors.phone = 'Phone must be 8-15 digits';
          }
          break;
        case 'link':
          if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value)) {
            newErrors.link = 'Please enter a valid URL';
          }
          break;
        case 'name':
          if (value.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
          }
          break;
        case 'address':
          if (value.length < 5) {
            newErrors.address = 'Address must be at least 5 characters';
          }
          break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    data: cafes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-cafes'],
    queryFn: fetchCafes,
    onError: (err) => {
      console.error("Error details:", err);
      toast.error(err.message);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  });

  const { mutate: deleteCafeMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteCafe,
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']);
      toast.success('Cafe deleted successfully');
      setOpenDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete cafe');
    }
  });

  const { mutate: createCafeMutation, isPending: isCreating } = useMutation({
    mutationFn: createCafe,
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']);
      toast.success('Cafe created successfully');
      setOpenAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create cafe');
    }
  });

  const { mutate: updateCafeMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateCafe,
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']);
      toast.success('Cafe updated successfully');
      setOpenEditDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update cafe');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      iframe: '',
      link: '',
      location: '',
      isActive: true,
      isFeatured: false
    });
    setErrors({});
  };

  const handleMenuOpen = (event, cafe) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCafe(cafe);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleEditClick = () => {
    if (selectedCafe) {
      setFormData({
        name: selectedCafe.name,
        address: selectedCafe.address,
        phone: selectedCafe.phone,
        iframe: selectedCafe.iframe || '',
        link: selectedCafe.link,
        location: selectedCafe.location,
        isActive: Boolean(selectedCafe.isActive),
        isFeatured: Boolean(selectedCafe.isFeatured)
      });
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };

  const handleAddClick = () => {
    resetForm();
    setOpenAddDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteCafeMutation(selectedCafe._id);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      handleValidation(e);
    }
  };

  const handleSubmit = (e, isEdit = false) => {
    e.preventDefault();

    if (isEdit && selectedCafe) {
      updateCafeMutation({ id: selectedCafe._id, cafeData: formData });
    } else {
      createCafeMutation(formData);
    }
  };

  const filteredCafes = React.useMemo(() => {
    return cafes.filter(cafe => {
      const search = searchTerm.toLowerCase();
      return (
        cafe.name.toLowerCase().includes(search) ||
        (cafe.location && cafe.location.toLowerCase().includes(search)) ||
        (cafe.address && cafe.address.toLowerCase().includes(search))
      );
    });
  }, [cafes, searchTerm]);

  const stats = React.useMemo(() => {
    return {
      total: cafes.length,
      active: cafes.filter(c => c.isActive).length,
      featured: cafes.filter(c => c.isFeatured).length,
      newThisMonth: cafes.filter(c => {
        if (!c.createdAt) return false;
        const cafeDate = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return cafeDate > monthAgo;
      }).length
    };
  }, [cafes]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Cafes Management</h2>
            <p className="text-gray-600">Manage all cafes in your system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <CafeIcon />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Cafes</p>
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
                  <p className="text-sm font-medium text-gray-500">Active Cafes</p>
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
                  <p className="text-sm font-medium text-gray-500">Featured Cafes</p>
                  <p className="text-2xl font-semibold text-gray-800">{isLoading ? '...' : stats.featured}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <NewIcon />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">New This Month</p>
                  <p className="text-2xl font-semibold text-gray-800">{isLoading ? '...' : stats.newThisMonth}</p>
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
                placeholder="Search cafes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <AddIcon className="mr-2" />
              Add New Cafe
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
              Error loading cafes: {error.message}
            </div>
          ) : filteredCafes.length === 0 ? (
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
              <h3 className="text-lg font-medium text-gray-900">No cafes found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? "We couldn't find any cafes matching your search. Try different keywords."
                  : "There are currently no cafes available. Please check back later."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCafes.map((cafe) => (
                <div
                  key={cafe._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                        {cafe.name}
                      </h2>
                      <div className="flex space-x-2">
                        {cafe.isFeatured && (
                          <span className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            <StarIcon className="mr-1" fontSize="small" /> Featured
                          </span>
                        )}
                        <span className={`flex items-center text-xs px-2 py-1 rounded-full ${cafe.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {cafe.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-start">
                        <MapPinIcon className="flex-shrink-0 mt-1 mr-2 text-gray-400" fontSize="small" />
                        <p className="text-sm">{cafe.location || "Location not specified"}</p>
                      </div>

                      <div className="flex items-start">
                        <HomeIcon className="flex-shrink-0 mt-1 mr-2 text-gray-400" fontSize="small" />
                        <p className="text-sm">{cafe.address || "No address provided"}</p>
                      </div>

                      {cafe.phone && (
                        <div className="flex items-start">
                          <PhoneIcon className="flex-shrink-0 mt-1 mr-2 text-gray-400" fontSize="small" />
                          <p className="text-sm">{cafe.phone}</p>
                        </div>
                      )}

                      {cafe.link && (
                        <div className="flex items-start">
                          <WebsiteIcon className="flex-shrink-0 mt-1 mr-2 text-gray-400" fontSize="small" />
                          <a
                            href={cafe.link.startsWith('http') ? cafe.link : `https://${cafe.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setFormData({
                          name: cafe.name,
                          address: cafe.address,
                          phone: cafe.phone,
                          iframe: cafe.iframe || '',
                          link: cafe.link,
                          location: cafe.location,
                          isActive: Boolean(cafe.isActive),
                          isFeatured: Boolean(cafe.isFeatured)
                        });
                        setSelectedCafe(cafe);
                        setOpenEditDialog(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCafe(cafe);
                        setOpenDeleteDialog(true);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {anchorEl && (
        <div
          className="fixed z-40 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={{
            top: anchorEl.getBoundingClientRect().bottom + window.scrollY,
            left: anchorEl.getBoundingClientRect().left + window.scrollX
          }}
        >
          <div className="py-1">
            <button
              onClick={handleEditClick}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <EditIcon fontSize="small" className="mr-3" />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <DeleteIcon fontSize="small" className="mr-3" />
              Delete
            </button>
          </div>
        </div>
      )}

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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Cafe</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{selectedCafe?.name}"? This action cannot be undone.
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
                  {isDeleting ? 'Deleting...' : 'Delete'}
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
                  <h3 className="text-lg font-medium text-white">Edit Cafe</h3>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
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
                        autoComplete="organization"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="edit-location"
                        value={formData.location}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                        autoComplete="address-level2"
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="edit-address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                        autoComplete="street-address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="edit-phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-link" className="block text-sm font-medium text-gray-700">
                        Website Link <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="text"
                          name="link"
                          id="edit-link"
                          value={formData.link.replace(/^https?:\/\//, '')}
                          onChange={handleInputChange}
                          onBlur={handleValidation}
                          className={`flex-1 min-w-0 block w-full rounded-none rounded-r-md border ${errors.link ? 'border-red-300' : 'border-gray-300'} focus:ring-amber-500 focus:border-amber-500 sm:text-sm py-2 px-3`}
                          placeholder="example.com"
                          required
                          autoComplete="url"
                        />
                      </div>
                      {errors.link && (
                        <p className="mt-1 text-sm text-red-600">{errors.link}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="edit-iframe" className="block text-sm font-medium text-gray-700">
                        Map Embed Code
                      </label>
                      <textarea
                        name="iframe"
                        id="edit-iframe"
                        rows={3}
                        value={formData.iframe}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        placeholder="Paste iframe code for maps..."
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
                  <h3 className="text-lg font-medium text-white">Add New Cafe</h3>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
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
                        autoComplete="organization"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="add-location" className="block text-sm font-medium text-gray-700">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="add-location"
                        value={formData.location}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                        autoComplete="address-level2"
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="add-address" className="block text-sm font-medium text-gray-700">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="add-address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                        autoComplete="street-address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="add-phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleValidation}
                        className={`mt-1 block w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                        required
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="add-link" className="block text-sm font-medium text-gray-700">
                        Website Link <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          https://
                        </span>
                        <input
                          type="text"
                          name="link"
                          id="add-link"
                          value={formData.link.replace(/^https?:\/\//, '')}
                          onChange={handleInputChange}
                          onBlur={handleValidation}
                          className={`flex-1 min-w-0 block w-full rounded-none rounded-r-md border ${errors.link ? 'border-red-300' : 'border-gray-300'} focus:ring-amber-500 focus:border-amber-500 sm:text-sm py-2 px-3`}
                          placeholder="example.com"
                          required
                          autoComplete="url"
                        />
                      </div>
                      {errors.link && (
                        <p className="mt-1 text-sm text-red-600">{errors.link}</p>
                      )}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="add-iframe" className="block text-sm font-medium text-gray-700">
                        Map Embed Code
                      </label>
                      <textarea
                        name="iframe"
                        id="add-iframe"
                        rows={3}
                        value={formData.iframe}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        placeholder="Paste iframe code for maps..."
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
                    disabled={isCreating || Object.keys(errors).length > 0}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm ${isCreating || Object.keys(errors).length > 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isCreating ? 'Creating...' : 'Create Cafe'}
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

export default DashboardCafes;