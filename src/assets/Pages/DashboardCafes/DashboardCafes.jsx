import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

// Axios global configuration
const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api'
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTQ4ZDQyNmQ2NDY5ZjVhZjZiZGMyNSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc1NDY1NTU3NH0.HNMW34AFxC3wNd3eWNofNY9aIUTDGjviQ8e6sHAUlGM'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Admin ${AUTH_TOKEN}`
  }
})

function DashboardCafes() {
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
    products: [{ productName: '', price: '' }]
  })
  const [notifications, setNotifications] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Add notification
  const addNotification = (message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    
    // Remove notification automatically after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id))
    }, 5000)
  }

 // Fetch all cafes
const fetchCafes = async () => {
  try {
    setLoading(true)
    const response = await api.get('/cafe/display-all-cafes')

    // لو الـ API راجع فيه كافيهات جوا object
    const cafesArray = response.data.cafes || []

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

  // Apply search filter
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle product input changes
  const handleProductChange = (index, e) => {
    const { name, value } = e.target
    const products = [...formData.products]
    products[index][name] = value
    setFormData(prev => ({
      ...prev,
      products
    }))
  }

  // Add new product field
  const addProductField = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productName: '', price: '' }]
    }))
  }

  // Remove product field
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

  // Add new cafe
  const handleAddCafe = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Filter out empty products
      const filteredProducts = formData.products.filter(
        product => product.productName.trim() && product.price
      )

      const payload = {
        ...formData,
        products: filteredProducts.length > 0 ? filteredProducts : undefined
      }

      await api.post('/cafe/add-cafe', payload)
      
      addNotification('Cafe added successfully')
      setShowModal(false)
      setFormData({
        name: '',
        address: '',
        phone: '',
        iframe: '',
        link: '',
        location: '',
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

  // Edit cafe
  const handleEditCafe = (cafe) => {
    setEditingCafe(cafe)
    setFormData({
      name: cafe.name,
      address: cafe.address,
      phone: cafe.phone,
      iframe: cafe.iframe || '',
      link: cafe.link,
      location: cafe.location,
      products: cafe.products && cafe.products.length > 0 
        ? cafe.products 
        : [{ productName: '', price: '' }]
    })
    setShowModal(true)
  }

  // Update cafe
  const handleUpdateCafe = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Filter out empty products
      const filteredProducts = formData.products.filter(
        product => product.productName.trim() && product.price
      )

      const payload = {
        ...formData,
        products: filteredProducts.length > 0 ? filteredProducts : undefined
      }

      await api.put(`/cafe/${editingCafe._id}`, payload)
      
      addNotification('Cafe updated successfully')
      setShowModal(false)
      setEditingCafe(null)
      setFormData({
        name: '',
        address: '',
        phone: '',
        iframe: '',
        link: '',
        location: '',
        products: [{ productName: '', price: '' }]
      })
      fetchCafes()
    } catch (error) {
      console.error('Error updating cafe:', error)
      addNotification('Failed to update cafe', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete cafe
  const handleDeleteCafe = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cafe?')) return
    
    try {
      await api.delete(`/cafe/${id}`)
      addNotification('Cafe deleted successfully')
      fetchCafes()
    } catch (error) {
      console.error('Error deleting cafe:', error)
      addNotification('Failed to delete cafe', 'error')
    }
  }

  // Close Modal and reset state
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
      products: [{ productName: '', price: '' }]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success'
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

      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filters */}
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

        {/* Cafes Table */}
        <div className="px-4 py-6 bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCafes.map((cafe) => (
                    <tr key={cafe._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cafe.name}</div>
                        <div className="text-sm text-gray-500">
                          <a href={cafe.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                            {cafe.link}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">{cafe.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cafe.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cafe.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        {cafe.products && cafe.products.length > 0 ? (
                          <div className="text-sm text-gray-900">
                            {cafe.products.map((product, index) => (
                              <div key={index} className="mb-1">
                                {product.productName}: {product.price} LE
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No products</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleEditCafe(cafe)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCafe(cafe._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
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

      {/* Add/Edit Cafe Modal */}
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

              {/* Products Section */}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={product.productName}
                        onChange={(e) => handleProductChange(index, e)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (LE)
                      </label>
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
    </div>
  )
}

export default DashboardCafes