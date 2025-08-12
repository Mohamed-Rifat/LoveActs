'use client'
import React, { useState } from 'react';
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
  MoreVert as MoreIcon 
} from '@mui/icons-material';

// API Base URL
const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api/cafe';

// API Functions
const fetchCafes = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/display-all-cafes`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching cafes:', error);
    throw new Error('Failed to fetch cafes');
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

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    location: ''
  });
  const queryClient = useQueryClient();
  const handleValidation = (e) => {
  const { name, value } = e.target;
  let newErrors = { ...errors };

  // Clear existing error
  delete newErrors[name];

  // Validate based on field name
  if (!value.trim()) {
    newErrors[name] = 'This field is required';
  } else {
    switch (name) {
      case 'phone':
        if (!/^[0-9]{8,15}$/.test(value)) {
          newErrors.phone = 'Phone must be 8-15 digits';
        }
        break;
      case 'link':
        if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.link = 'Please enter a valid domain';
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
};

  // Fetch cafes data
  const { data: cafes = [], isLoading, error } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchCafes,
    onError: (err) => toast.error(err.message)
  });

  // Delete cafe mutation
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

  // Create cafe mutation
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

  // Update cafe mutation
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
      location: ''
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event, cafe) => {
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
        location: selectedCafe.location
      });
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteCafeMutation(selectedCafe._id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validate all fields before submission
  const formFields = e.target.elements;
  let validationErrors = {};
  
  Array.from(formFields).forEach(field => {
    if (field.required && !field.value.trim()) {
      validationErrors[field.name] = 'This field is required';
    }
  });

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error('Please fix the errors before submitting');
    return;
  }

  // Proceed with form submission
  createCafeMutation(formData);
};

  // Filter cafes
  const filteredCafes = React.useMemo(() => {
    return cafes.filter(cafe => {
      const search = searchTerm.toLowerCase();
      return (
        cafe.name.toLowerCase().includes(search) ||
        cafe.location.toLowerCase().includes(search) ||
        cafe.address.toLowerCase().includes(search)
      );
    });
  }, [cafes, searchTerm]);

  // Stats calculation
  const stats = React.useMemo(() => {
    return {
      total: cafes.length,
      active: cafes.filter(c => c.isActive).length,
      featured: cafes.filter(c => c.isFeatured).length,
      newThisMonth: cafes.filter(c => {
        const cafeDate = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return cafeDate > monthAgo;
      }).length
    };
  }, [cafes]);

  // Drawer items
  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Cafes', icon: <CafeIcon />, active: true },
    { text: 'Users', icon: <UsersIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> }
  ];

  return (
    <div className="dashboard-container">
      {/* App Bar */}
      <header className="app-bar">
        <div className="app-bar-content">
          <button className="menu-button" onClick={handleDrawerToggle}>
            <MenuIcon />
          </button>
          <h1 className="app-title">Admin Dashboard</h1>
          <button 
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <nav className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>Love Acts</h2>
          </div>
          <div className="divider"></div>
          <ul className="sidebar-menu">
            {drawerItems.map((item) => (
              <li 
                key={item.text}
                className={`menu-item ${item.active ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <div className="content-header">
            <h2>Cafes Management</h2>
            <p>Manage all cafes in your system</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Cafes</h3>
              <p>{isLoading ? '...' : stats.total}</p>
            </div>
            <div className="stat-card">
              <h3>Active Cafes</h3>
              <p>{isLoading ? '...' : stats.active}</p>
            </div>
            <div className="stat-card">
              <h3>Featured Cafes</h3>
              <p>{isLoading ? '...' : stats.featured}</p>
            </div>
            <div className="stat-card">
              <h3>New This Month</h3>
              <p>{isLoading ? '...' : stats.newThisMonth}</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="actions-bar">
            <div className="search-container">
              <SearchIcon className="search-icon" />
              <input 
                type="text" 
                placeholder="Search cafes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-button" onClick={handleAddClick}>
              <AddIcon /> Add New Cafe
            </button>
          </div>

          {/* Cafes Table */}
          <div className="table-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="error-message">
                Error loading cafes: {error.message}
              </div>
            ) : (
              <table className="cafes-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Website</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCafes.map((cafe) => (
                    <tr key={cafe._id}>
                      <td>{cafe.name}</td>
                      <td>{cafe.location}</td>
                      <td>{cafe.address}</td>
                      <td>{cafe.phone}</td>
                      <td>
                        <a href={cafe.link} target="_blank" rel="noopener noreferrer">
                          Visit
                        </a>
                      </td>
                      <td>
                        <button 
                          className="more-button"
                          onClick={(e) => handleMenuOpen(e, cafe)}
                        >
                          <MoreIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Context Menu */}
      {anchorEl && (
        <div className="context-menu" style={{ 
          top: anchorEl.getBoundingClientRect().bottom, 
          left: anchorEl.getBoundingClientRect().left 
        }}>
          <div className="menu-item" onClick={handleEditClick}>
            <EditIcon fontSize="small" />
            <span>Edit</span>
          </div>
          <div className="menu-item" onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" />
            <span>Delete</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {openDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-container">
            <h3 className="dialog-title">Confirm Delete</h3>
            <div className="dialog-content">
              <p>Are you sure you want to delete "{selectedCafe?.name}"? This action cannot be undone.</p>
            </div>
            <div className="dialog-actions">
              <button 
                className="cancel-button" 
                onClick={() => setOpenDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Cafe Dialog */}
      {openEditDialog && (
        <div className="dialog-overlay">
          <div className="dialog-container">
            <h3 className="dialog-title">Edit Cafe</h3>
            <form className="dialog-content" onSubmit={(e) => handleSubmit(e, true)}>
              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address <span className="required">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone <span className="required">*</span></label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location <span className="required">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Website Link <span className="required">*</span></label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Map Iframe</label>
                <textarea
                  name="iframe"
                  value={formData.iframe}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="dialog-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setOpenEditDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cafe Dialog */}
{openAddDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-4 text-white">
        <h3 className="text-xl font-bold">Add New Cafe</h3>
      </div>
      
      {/* Form with enhanced validation */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
        {/* Name Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleValidation}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
            placeholder="Enter cafe name"
            required
            minLength={3}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleValidation}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
            placeholder="Enter cafe address"
            required
            minLength={5}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleValidation}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
            placeholder="Enter phone number"
            required
            pattern="[0-9]{8,15}"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.phone || "Must be 8-15 digits"}
            </p>
          )}
        </div>

        {/* Location Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            onBlur={handleValidation}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
            }`}
            placeholder="Enter location (e.g. Downtown)"
            required
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Website Link Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Website Link <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              https://
            </span>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              onBlur={handleValidation}
              className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border focus:outline-none focus:ring-2 ${
                errors.link ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-amber-500'
              }`}
              placeholder="example.com"
              required
              pattern="^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            />
          </div>
          {errors.link && (
            <p className="text-red-500 text-xs mt-1">
              {errors.link || "Must be a valid domain (e.g. example.com)"}
            </p>
          )}
        </div>

        {/* Map Iframe Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Map Embed Code
          </label>
          <textarea
            name="iframe"
            value={formData.iframe}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
            placeholder="Paste iframe code for maps..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Embed code from Google Maps or other mapping services
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setOpenAddDialog(false);
              setErrors({});
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || Object.keys(errors).length > 0}
            className={`px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
              isCreating || Object.keys(errors).length > 0 ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isCreating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Cafe'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}