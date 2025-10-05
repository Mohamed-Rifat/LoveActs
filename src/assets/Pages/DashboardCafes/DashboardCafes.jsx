import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToken } from "./../../Context/TokenContext/TokenContext";
import CafeModal from "../../Components/Dashboard/Cafes/CafeModal";
import CafeProductsModal from "../../Components/Dashboard/Cafes/CafeProductsModal";
import Notification from "../../Components/Dashboard/Cafes/Notification";
import CafesTable from "../../Components/Dashboard/Cafes/CafesTable";
import SearchBar from "../../Components/Dashboard/Cafes/SearchBar ";
import Header from "../../Components/Dashboard/Cafes/Header";

const DashboardCafes = () => {
  const { token } = useToken()
  const [cafes, setCafes] = useState([])
  const [filteredCafes, setFilteredCafes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCafe, setEditingCafe] = useState(null)
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

  const initialFormData = {
    name: '',
    address: '',
    phone: '',
    iframe: '',
    link: '',
    location: '',
    image: null,
    products: [{ productName: '', price: '', image: null }]
  }
  const [formData, setFormData] = useState(initialFormData)

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

          if (p.image && typeof p.image !== "string") {
            payload.append(`products[${i}][image]`, p.image);
          }
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
      setFormData(initialFormData);
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

          if (product.image) {
            formDataToSend.append(`products[${index}][image]`, product.image)
          }
        }
      })


      await api.post('/cafe/add-cafe', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      addNotification('Cafe added successfully')
      setShowModal(false)
      setFormData(initialFormData)
      fetchCafes()
    } catch (error) {
      console.error('Error adding cafe:', error)
      addNotification('Failed to add cafe', 'error')
    } finally {
      setSubmitting(false)
    }
  }

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
    setFormData(initialFormData)
  }

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
    const { name, value, type, files } = e.target;
    const products = [...formData.products];

    if (type === "file") {
      products[index][name] = files[0];
    } else {
      products[index][name] = value;
    }

    setFormData(prev => ({
      ...prev,
      products
    }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} />

      <Header onAddCafe={() => setShowModal(true)} />

      <main className=" mx-auto py-6 sm:px-6 lg:px-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <CafesTable
          cafes={filteredCafes}
          loading={loading}
          onEditCafe={handleEditCafe}
          onDeleteCafe={handleDeleteCafe}
          onShowProducts={handleShowProducts}
          onAddCafe={() => setShowModal(true)}
        />
      </main>

      {showModal && (
        <CafeModal
          editingCafe={editingCafe}
          formData={formData}
          submitting={submitting}
          onClose={handleCloseModal}
          onSubmit={editingCafe ? handleUpdateCafe : handleAddCafe}
          onInputChange={handleInputChange}
          onProductChange={handleProductChange}
          onAddProduct={addProductField}
          onRemoveProduct={removeProductField}
        />
      )}

      <CafeProductsModal
        cafe={selectedCafe}
        isOpen={showProductsModal}
        onClose={handleCloseProductsModal}
      />
    </div>
  )
}

export default DashboardCafes