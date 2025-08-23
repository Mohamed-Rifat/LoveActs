// import React, { useState, useEffect } from 'react'

// const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api'
// const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTQ4ZDQyNmQ2NDY5ZjVhZjZiZGMyNSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc1NDY1NTU3NH0.HNMW34AFxC3wNd3eWNofNY9aIUTDGjviQ8e6sHAUlGM'

// export default function Cafes() {
//   const [cafes, setCafes] = useState([])
//   const [filteredCafes, setFilteredCafes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedLocation, setSelectedLocation] = useState('all')

//   const fetchCafes = async () => {
//     try {
//       setLoading(true)

//       const response = await fetch(`${API_BASE_URL}/cafe/display-all-cafes`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${AUTH_TOKEN}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       setCafes(data.cafes || []);
//       setFilteredCafes(data.cafes || []);

//     } catch (error) {
//       console.error('Error fetching cafes:', error)
//       setCafes(mockCafes)
//       setFilteredCafes(mockCafes)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchCafes()
//   }, [])

//   useEffect(() => {
//     let result = cafes

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       result = result.filter(cafe =>
//         cafe.name.toLowerCase().includes(term) ||
//         (cafe.address && cafe.address.toLowerCase().includes(term)) ||
//         (cafe.location && cafe.location.toLowerCase().includes(term))
//       )
//     }

//     if (selectedLocation !== 'all') {
//       result = result.filter(cafe => cafe.location === selectedLocation)
//     }

//     setFilteredCafes(result)
//   }, [searchTerm, selectedLocation, cafes])

//   const locations = [...new Set(cafes.map(cafe => cafe.location).filter(Boolean))]

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
//           <p className="mt-4 text-amber-800">جاري تحميل بيانات المقاهي...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
//       <header className="bg-gradient-to-r from-amber-600 to-amber-800 shadow-lg">
//         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl font-bold text-white">قهوتنا</h1>
//           <p className="mt-2 text-lg text-amber-100">استمتع بأفضل المقاهي في مدينتك</p>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
//                 ابحث عن مقهى
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   id="search"
//                   placeholder="ابحث باسم المقهى أو العنوان..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
//                 الموقع
//               </label>
//               <select
//                 id="location"
//                 value={selectedLocation}
//                 onChange={(e) => setSelectedLocation(e.target.value)}
//                 className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//               >
//                 <option value="all">جميع المواقع</option>
//                 {locations.map(location => (
//                   <option key={location} value={location}>{location}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-amber-900">قائمة المقاهي</h2>
//           <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
//             {filteredCafes.length} مقهى
//           </span>
//         </div>

//         {filteredCafes.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد مقاهي</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               لا توجد مقاهي تطابق معايير البحث الخاصة بك
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCafes.map((cafe) => (
//               <div key={cafe._id || cafe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-amber-100">
//                 <div className="p-6">
//                   <div className="flex justify-between items-start">
//                     <h3 className="text-xl font-bold text-gray-900">{cafe.name}</h3>
//                     {cafe.location && (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
//                         {cafe.location}
//                       </span>
//                     )}
//                   </div>

//                   <div className="mt-4 space-y-3">
//                     {cafe.address && (
//                       <div className="flex items-start">
//                         <svg className="h-5 w-5 text-amber-500 mt-0.5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                         <p className="text-gray-600 text-sm">{cafe.address}</p>
//                       </div>
//                     )}

//                     {cafe.phone && (
//                       <div className="flex items-center">
//                         <svg className="h-5 w-5 text-amber-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                         </svg>
//                         <a href={`tel:${cafe.phone}`} className="text-amber-600 hover:text-amber-700 text-sm">
//                           {cafe.phone}
//                         </a>
//                       </div>
//                     )}

//                     {cafe.link && (
//                       <div className="flex items-center">
//                         <svg className="h-5 w-5 text-amber-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                         </svg>
//                         <a href={cafe.link} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 truncate text-sm">
//                           زيارة الموقع
//                         </a>
//                       </div>
//                     )}
//                   </div>

//                   {cafe.products && cafe.products.length > 0 && (
//                     <div className="mt-6 pt-4 border-t border-gray-200">
//                       <h4 className="text-sm font-medium text-gray-900 mb-3">قائمة المنتجات</h4>
//                       <div className="space-y-2">
//                         {cafe.products.map((product, index) => (
//                           <div key={index} className="flex justify-between text-sm">
//                             <span className="text-gray-600">{product.productName}</span>
//                             <span className="font-medium text-amber-600">{product.price} ج.م</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {cafe.iframe && (
//                     <div className="mt-6 pt-4 border-t border-gray-200">
//                       <h4 className="text-sm font-medium text-gray-900 mb-3">الموقع على الخريطة</h4>
//                       <div
//                         className="w-full h-40 rounded-md overflow-hidden"
//                         dangerouslySetInnerHTML={{ __html: cafe.iframe }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const mockCafes = [
//   {
//     id: 1,
//     name: "مقهى الفرسان",
//     address: "123 شارع التحرير، وسط البلد",
//     phone: "0123456789",
//     location: "القاهرة",
//     link: "https://example.com",
//     products: [
//       { productName: "إسبريسو", price: 25 },
//       { productName: "كابتشينو", price: 30 },
//       { productName: "لاتيه", price: 35 }
//     ]
//   },
//   {
//     id: 2,
//     name: "كافيه النخلة",
//     address: "456 شارع البحر، المعادي",
//     phone: "0123456780",
//     location: "الجيزة",
//     link: "https://example.com",
//     products: [
//       { productName: "شاي أخضر", price: 20 },
//       { productName: "موكا", price: 40 },
//       { productName: "آيس كوفي", price: 35 }
//     ]
//   },
//   {
//     id: 3,
//     name: "قهوة العروبة",
//     address: "789 شارع الهرم",
//     phone: "0123456781",
//     location: "القاهرة",
//     link: "https://example.com",
//     products: [
//       { productName: "أمريكانو", price: 25 },
//       { productName: "كولد برو", price: 45 },
//       { productName: "شوكولاتة ساخنة", price: 30 }
//     ]
//   }
// ]

import React from 'react'

export default function Cafes() {
  return (
    <div>Under Dev Coding</div>
  )
}
