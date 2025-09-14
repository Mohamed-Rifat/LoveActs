import axios from 'axios'
import { useToken } from '../../Context/TokenContext/TokenContext'
import React, { useState, useEffect } from 'react';

const CafeProductsModal = ({ cafe, isOpen, onClose, onUpdateProduct }) => {
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({ productName: '', price: '' })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (editingProduct) {
      setEditForm({
        productName: editingProduct.productName,
        price: editingProduct.price
      })
    }
  }, [editingProduct])

  const handleEditClick = (product) => {
    setEditingProduct(product)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditForm({ productName: '', price: '' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Products {cafe.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          {cafe.products && cafe.products.length > 0 ? (
            <div className="space-y-4">
              {cafe.products.map((product, index) => (
                <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {editingProduct && editingProduct._id === product._id ? (
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input
                            type="text"
                            name="productName"
                            value={editForm.productName}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                          <input
                            type="number"
                            name="price"
                            value={editForm.price}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.productName}</h4>
                        <p className="text-sm text-gray-500 mt-1">Price: {product.price} LE</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-indigo-600">
                          {product.price} LE
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Products</h3>
              <p className="mt-1 text-sm text-gray-500">
                No products have been added for this cafe yet.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function DashboardCafes() {
  const { token } = useToken()
  const [cafes, setCafes] = useState([])
  const [filteredCafes, setFilteredCafes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCafe, setEditingCafe] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    iframe: '',
    link: '',
    location: '',
    image: null,
    products: [{ productName: '', price: '' }]
  })
  const [notifications, setNotifications] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [selectedCafe, setSelectedCafe] = useState(null)
  const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api'

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Admin ${token}`
    }
  })

  const addNotification = (message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id))
    }, 5000)
  }

  const fetchCafes = async () => {
    try {
      setLoading(true)
      const response = await api.get('/cafe/display-all-cafes')

      const cafesArray = response.data.cafeData || []

      setCafes(cafesArray)
      setFilteredCafes(cafesArray)
    } catch (error) {
      console.error('Error fetching cafes:', error)
      addNotification('Failed to fetch cafes', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCafes()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const result = cafes.filter(cafe =>
        cafe.name.toLowerCase().includes(term) ||
        cafe.address?.toLowerCase().includes(term) ||
        cafe.location?.toLowerCase().includes(term)
      )
      setFilteredCafes(result)
    } else {
      setFilteredCafes(cafes)
    }
  }, [searchTerm, cafes])

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleProductChange = (index, e) => {
    const { name, value } = e.target
    const products = [...formData.products]
    products[index][name] = value
    setFormData(prev => ({
      ...prev,
      products
    }))
  }

  const addProductField = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productName: '', price: '' }]
    }))
  }

  const removeProductField = (index) => {
    if (formData.products.length > 1) {
      const products = [...formData.products]
      products.splice(index, 1)
      setFormData(prev => ({
        ...prev,
        products
      }))
    }
  }

  const handleAddCafe = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('link', formData.link)
      formDataToSend.append('location', formData.location)

      if (formData.iframe) {
        formDataToSend.append('iframe', formData.iframe)
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      formData.products.forEach((product, index) => {
        if (product.productName && product.price) {
          formDataToSend.append(`products[${index}][productName]`, product.productName)
          formDataToSend.append(`products[${index}][price]`, product.price)
        }
      })

      await api.post('/cafe/add-cafe', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      addNotification('Cafe added successfully')
      setShowModal(false)
      setFormData({
        name: '',
        address: '',
        phone: '',
        iframe: '',
        link: '',
        location: '',
        image: null,
        products: [{ productName: '', price: '' }]
      })
      fetchCafes()
    } catch (error) {
      console.error('Error adding cafe:', error)
      addNotification('Failed to add cafe', 'error')
    } finally {
      setSubmitting(false)
    }
  }

const handleEditCafe = (cafe) => {
  setEditingCafe(cafe);
  setFormData({
    name: cafe.name || '',
    address: cafe.address || '',
    phone: cafe.phone || '',
    iframe: cafe.iframe || '',
    link: cafe.link || '',
    location: cafe.location || '',
    image: cafe.image || null, 
    products: cafe.products && cafe.products.length > 0
      ? cafe.products.map(p => ({
          productName: p.productName || '',
          price: p.price || ''
        }))
      : [{ productName: '', price: '' }]
  });
  setShowModal(true);
};

const handleUpdateCafe = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    if (!editingCafe?._id) {
      addNotification('No cafe selected to update', 'error');
      return;
    }

    let payload;
    let headers;

    if (formData.image && typeof formData.image !== "string") {
      payload = new FormData();
      payload.append('name', formData.name);
      payload.append('address', formData.address);
      payload.append('phone', formData.phone);
      payload.append('link', formData.link);
      payload.append('location', formData.location);
      payload.append('iframe', formData.iframe || '');
      payload.append('image', formData.image);

      formData.products.forEach((p, i) => {
        payload.append(`products[${i}][productName]`, p.productName);
        payload.append(`products[${i}][price]`, p.price);
      });

      headers = { 'Content-Type': 'multipart/form-data', Authorization: `Admin ${token}` };

    } else {
      payload = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        link: formData.link,
        location: formData.location,
        iframe: formData.iframe || '',
        products: formData.products,
        image: typeof formData.image === "string" ? formData.image : undefined, 
      };

      headers = { 'Content-Type': 'application/json', Authorization: `Admin ${token}` };
    }

    await api.put(`/cafe/update-cafe/${editingCafe._id}`, payload, { headers });

    addNotification('Cafe updated successfully');
    setShowModal(false);
    setEditingCafe(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      iframe: '',
      link: '',
      location: '',
      image: null,
      products: [{ productName: '', price: '' }],
    });

    fetchCafes();
  } catch (error) {
  console.error('Error updating cafe:', error);

  let message = error.response?.data?.error || 'Failed to update cafe';

  if (typeof message === "object") {
    message = message.en || 'Failed to update cafe';
  }

  addNotification(message, 'error');
} finally {
    setSubmitting(false);
  }
};



const handleUpdateProduct = async (cafeId, productId, productData) => {
  try {
    console.log("Updating product with:", { cafeId, productId, productData });

    const response = await api.put(
      `/cafe/update-cafe-products/${cafeId}/${productId}`,
      {
        productName: productData.productName,
        price: productData.price,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Admin ${token}`,
        },
      }
    );

    addNotification('Product updated successfully');

    setCafes(prevCafes =>
      prevCafes.map(cafe => (cafe._id === cafeId ? response.data.cafe : cafe))
    );

    if (selectedCafe && selectedCafe._id === cafeId) {
      setSelectedCafe(response.data.cafe);
    }

    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);

    const message = error.response?.data?.message || 'Failed to update product';
    addNotification(message, 'error');

    return null;
  }
};




  const handleDeleteCafe = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cafe?')) return

    try {
      await api.delete(`/cafe/delete-cafe/${id}`)
      addNotification('Cafe deleted successfully')
      fetchCafes()
    } catch (error) {
      console.error('Error deleting cafe:', error)
      addNotification('Failed to delete cafe', 'error')
    }
  }

  const handleShowProducts = (cafe) => {
    setSelectedCafe(cafe)
    setShowProductsModal(true)
  }

  const handleCloseProductsModal = () => {
    setShowProductsModal(false)
    setSelectedCafe(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCafe(null)
    setFormData({
      name: '',
      address: '',
      phone: '',
      iframe: '',
      link: '',
      location: '',
      image: null,
      products: [{ productName: '', price: '' }]
    })
  }

  const truncateText = (text, maxLength = 25) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 ${notification.type === 'success'
              ? 'bg-green-100 text-green-800 border-green-500'
              : 'bg-red-100 text-red-800 border-red-500'
              }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Cafes Management Dashboard</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-200"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Cafe
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 bg-white shadow rounded-lg mb-6 border border-gray-200">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Cafes
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search by cafe name, address or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-6 bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredCafes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No cafes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No cafes match your search criteria
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Cafe
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-left">Image</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-left">Name</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-left">Address</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-left">Phone</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-left">Location</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-left">Products</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCafes.map((cafe) => (
                    <tr key={cafe._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 max-w-[120px]">
                        {cafe.image ? (
                          <img
                            src={cafe.image}
                            alt={cafe.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                            <img src='/Logo.PNG'></img>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <div className="text-sm font-medium text-gray-900 truncate" title={cafe.name}>
                          {truncateText(cafe.name, 20)}
                        </div>
                        {cafe.link && (
                          <div className="text-xs text-indigo-600 truncate" title={cafe.link}>
                            <a
                              href={cafe.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {truncateText(cafe.link, 25)}
                            </a>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 max-w-[220px]">
                        <div className="text-sm text-gray-800 truncate" title={cafe.address}>
                          {truncateText(cafe.address, 30)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cafe.phone}</div>
                      </td>

                      <td className="px-6 py-4 max-w-[200px]">
                        <div
                          className="text-sm text-gray-700 truncate cursor-help"
                          title={cafe.location}
                        >
                          {truncateText(cafe.location, 25)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleShowProducts(cafe)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View Products</span>
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCafe(cafe)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCafe(cafe._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 px-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCafe ? 'Edit Cafe' : 'Add New Cafe'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={editingCafe ? handleUpdateCafe : handleAddCafe} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Cafe Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                    Link *
                  </label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Cafe Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="iframe" className="block text-sm font-medium text-gray-700 mb-1">
                    Map Iframe (Optional)
                  </label>
                  <textarea
                    id="iframe"
                    name="iframe"
                    value={formData.iframe}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Products (Optional)</h4>
                  <button
                    type="button"
                    onClick={addProductField}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Product
                  </button>
                </div>

                {formData.products.map((product, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        name="productName"
                        value={product.productName}
                        onChange={(e) => handleProductChange(index, e)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (LE)</label>
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={(e) => handleProductChange(index, e)}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductField(index)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                        >
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 space-x-3 space-x-reverse border-t mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingCafe ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingCafe ? 'Update Cafe' : 'Add Cafe'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CafeProductsModal
        cafe={selectedCafe}
        isOpen={showProductsModal}
        onClose={handleCloseProductsModal}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  )
}

export default DashboardCafes