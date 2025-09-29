import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaSpinner, FaCheckCircle, FaTimesCircle, FaBoxOpen,
  FaClock, FaTruck, FaMapMarkerAlt, FaPhone, FaCoffee,
  FaCalendarAlt, FaReceipt, FaShoppingBag, FaStore
} from 'react-icons/fa';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token')?.replace(/^User\s+|^Admin\s+/, '');

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await axios.get('https://flowers-vert-six.vercel.app/api/order', {
          headers: {
            Authorization: `User ${token}`
          }
        });

        const backendOrders = response.data.orders || [];
        console.log("📦 Orders from backend:", backendOrders);
        setOrders(backendOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token]);

  const selectOrderFromList = (order) => {
    setSelectedOrder(order);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'processing':
        return <FaTruck className="text-blue-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const renderCafeName = (cafe) => {
    if (typeof cafe === 'string') {
      return cafe;
    } else if (cafe && typeof cafe === 'object' && cafe.name) {
      return cafe.name;
    }
    return 'Unknown Cafe';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-[#FDE9EE] to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl shadow-lg">
              <FaReceipt className="text-white text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-700 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <p className="text-gray-600 ml-16">Track and manage your coffee orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 flex items-center gap-2">
              <FaTimesCircle />
              {error}
            </p>
          </div>
        )}

        {loadingOrders && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loader">
              <div className="truckWrapper">
                <div className="truckBody">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 198 93"
                    className="trucksvg"
                  >
                    <path
                      strokeWidth="3"
                      stroke="#282828"
                      fill="#F83D3D"
                      d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
                    ></path>
                    <path
                      strokeWidth="3"
                      stroke="#282828"
                      fill="#7D7C7C"
                      d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
                    ></path>
                    <path
                      strokeWidth="2"
                      stroke="#282828"
                      fill="#282828"
                      d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
                    ></path>
                    <rect
                      strokeWidth="2"
                      stroke="#282828"
                      fill="#FFFCAB"
                      rx="1"
                      height="7"
                      width="5"
                      y="63"
                      x="187"
                    ></rect>
                    <rect
                      strokeWidth="2"
                      stroke="#282828"
                      fill="#282828"
                      rx="1"
                      height="11"
                      width="4"
                      y="81"
                      x="193"
                    ></rect>
                    <rect
                      strokeWidth="3"
                      stroke="#282828"
                      fill="#DFDFDF"
                      rx="2.5"
                      height="90"
                      width="121"
                      y="1.5"
                      x="6.5"
                    ></rect>
                    <rect
                      strokeWidth="2"
                      stroke="#282828"
                      fill="#DFDFDF"
                      rx="2"
                      height="4"
                      width="6"
                      y="84"
                      x="1"
                    ></rect>
                  </svg>
                </div>
                <div className="truckTires">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 30 30"
                    className="tiresvg"
                  >
                    <circle
                      strokeWidth="3"
                      stroke="#282828"
                      fill="#282828"
                      r="13.5"
                      cy="15"
                      cx="15"
                    ></circle>
                    <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 30 30"
                    className="tiresvg"
                  >
                    <circle
                      strokeWidth="3"
                      stroke="#282828"
                      fill="#282828"
                      r="13.5"
                      cy="15"
                      cx="15"
                    ></circle>
                    <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                  </svg>
                </div>
                <div className="road"></div>

                <svg
                  space="preserve"
                  viewBox="0 0 453.459 453.459"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Capa_1"
                  version="1.1"
                  fill="#000000"
                  className="lampPost"
                >
                  <path
                    d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"
                  ></path>
                </svg>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>

            <style jsx>{`
              .loader {
                width: fit-content;
                height: fit-content;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 2rem auto;
              }

              .truckWrapper {
                width: 200px;
                height: 100px;
                display: flex;
                flex-direction: column;
                position: relative;
                align-items: center;
                justify-content: flex-end;
                overflow-x: hidden;
              }

              .truckBody {
                width: 130px;
                height: fit-content;
                margin-bottom: 6px;
                animation: motion 1s linear infinite;
              }

              @keyframes motion {
                0% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(3px);
                }
                100% {
                  transform: translateY(0px);
                }
              }

              .truckTires {
                width: 130px;
                height: fit-content;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0px 10px 0px 15px;
                position: absolute;
                bottom: 0;
              }
              
              .truckTires svg {
                width: 24px;
              }

              .road {
                width: 100%;
                height: 1.5px;
                background-color: #282828;
                position: relative;
                bottom: 0;
                align-self: flex-end;
                border-radius: 3px;
              }
              
              .road::before {
                content: "";
                position: absolute;
                width: 20px;
                height: 100%;
                background-color: #282828;
                right: -50%;
                border-radius: 3px;
                animation: roadAnimation 1.4s linear infinite;
                border-left: 10px solid white;
              }
              
              .road::after {
                content: "";
                position: absolute;
                width: 10px;
                height: 100%;
                background-color: #282828;
                right: -65%;
                border-radius: 3px;
                animation: roadAnimation 1.4s linear infinite;
                border-left: 4px solid white;
              }

              .lampPost {
                position: absolute;
                bottom: 0;
                right: -90%;
                height: 90px;
                animation: roadAnimation 1.4s linear infinite;
              }

              @keyframes roadAnimation {
                0% {
                  transform: translateX(0px);
                }
                100% {
                  transform: translateX(-350px);
                }
              }
            `}</style>
          </div>
        )}

        {!loadingOrders && (
          <>
            {orders.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-40 h-40 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <FaBoxOpen className="text-5xl text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h3>
                <p className="text-gray-600 max-w-md mb-8">
                  You haven't placed any orders yet. Explore our delicious coffee selection and place your first order!
                </p>
                <Link
                  to="/cafes"
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-rose-600 hover:to-pink-700"
                >
                  <FaStore className="text-lg" />
                  Browse Cafes & Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-rose-400 to-pink-500 text-white">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FaBoxOpen />
                        Orders ({orders.length})
                      </h2>
                    </div>

                    <div className="max-h-[600px] overflow-y-auto">
                      <div className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            onClick={() => selectOrderFromList(order)}
                            className={`p-6 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:shadow-md ${selectedOrder?._id === order._id
                              ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-r-4 border-rose-400 shadow-sm'
                              : ''
                              }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                                  <FaCoffee className="text-rose-600 text-sm" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                                  <p className="text-xs text-gray-500">{renderCafeName(order.cafe)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-800"> {formatCurrency(
                                  (order.totalPrice || 0) +
                                  (order.cafeProduct?.price || 0)
                                )}</p>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  <span className="capitalize">{order.status}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {order.cafeProduct?.name || 'Product name not available'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FaCalendarAlt />
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FaMapMarkerAlt />
                                  {order.address
                                    ? `${order.address.street}, ${order.address.city}, ${order.address.country}`
                                    : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 overflow-hidden h-fit">
                    {selectedOrder ? (
                      <>
                        <div className="p-6 bg-gradient-to-r from-rose-400 to-pink-500 text-white">
                          <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaReceipt />
                            Order Details
                          </h2>
                        </div>

                        <div className="p-8 space-y-8">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-gray-800">
                                Order #{selectedOrder._id.slice(-8).toUpperCase()}
                              </h3>
                              <p className="text-gray-600">Placed on {formatDate(selectedOrder.createdAt)}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Status:</span>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                                  {getStatusIcon(selectedOrder.status)}
                                  <span className="capitalize">{selectedOrder.status}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-100">
                              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                              <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-700 bg-clip-text text-transparent">
                                {formatCurrency(
                                  (selectedOrder.totalPrice || 0) + (selectedOrder.cafeProduct?.price || 0)
                                )}
                              </p>
                            </div>

                          </div>
                          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg font-medium">
                            ⚠️ A delivery charge of 50 EGP will be added to the total amount if the order is for delivery. If the order is for pickup, the 50 EGP will not be charged.
                          </div>
                          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <FaCoffee className="text-rose-500" />
                              Product Details
                            </h4>

                            {selectedOrder.productId && (
                              <div className="bg-white rounded-lg p-4 border border-rose-200 shadow-sm mb-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold text-gray-800">{selectedOrder.productId.name}</p>
                                    <p className="text-sm text-gray-600">Main Product</p>
                                  </div>
                                  <p className="text-lg font-bold text-rose-600">
                                    {formatCurrency(selectedOrder.totalPrice)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {selectedOrder.cafeProduct && (
                              <div className="bg-white rounded-lg p-4 border border-rose-200 shadow-sm">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold text-gray-800">{selectedOrder.cafeProduct.name}</p>
                                    <p className="text-sm text-gray-600">From {renderCafeName(selectedOrder.cafe)}</p>
                                  </div>
                                  <p className="text-lg font-bold text-rose-600">
                                    {formatCurrency(selectedOrder.cafeProduct.price)}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaPhone className="text-blue-500" />
                                Contact Information
                              </h4>
                              <p className="text-gray-700 font-medium"><strong>Phone:</strong> {selectedOrder.contactPhone || 'N/A'}</p>
                              <p className="text-gray-700 font-medium"><strong>Date:</strong> {selectedOrder?.selectedDate || "N/A"}</p>
                              <p className="text-gray-700 font-medium"><strong>Time:</strong> {selectedOrder?.selectedTimeSlote || "N/A"}</p>
                            </div>

                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-emerald-500" />
                                Delivery Address
                              </h4>
                              <div className="text-gray-700 space-y-1">
                                <p>{selectedOrder.address?.street || 'N/A'}</p>
                                <p>{selectedOrder.address?.city || 'N/A'}, {selectedOrder.address?.country || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {selectedOrder.cancelledAt && (
                            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaTimesCircle className="text-red-500" />
                                Cancellation Details
                              </h4>
                              <p className="text-gray-700">
                                Order was cancelled on {formatDate(selectedOrder.cancelledAt)}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                          <FaBoxOpen className="text-3xl text-rose-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select an Order</h3>
                        <p className="text-gray-500">Choose an order from the list to view detailed information</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}