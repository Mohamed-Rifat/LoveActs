import React from 'react';

const CafesTable = ({ cafes, loading, onEditCafe, onDeleteCafe, onShowProducts, onAddCafe }) => {
  const truncateText = (text, maxLength = 25) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
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
            onClick={onAddCafe}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Cafe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden border border-gray-200">
      <div className="hidden lg:block overflow-x-auto rounded-lg shadow">
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
            {cafes.map((cafe) => (
              <tr key={cafe._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 max-w-[120px]">
                  {cafe.image ? (
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                      <img src='/Logo.PNG' alt="logo" />
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
                    onClick={() => onShowProducts(cafe)}
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
                      onClick={() => onEditCafe(cafe)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteCafe(cafe._id)}
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

      <div className="lg:hidden space-y-4 p-4">
        {cafes.map((cafe) => (
          <div key={cafe._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {cafe.image ? (
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-14 h-14 object-cover rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 flex-shrink-0">
                      <img src='/Logo.PNG' alt="logo" className="w-8 h-8" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate" title={cafe.name}>
                      {cafe.name}
                    </h3>
                    {cafe.link && (
                      <div className="text-xs text-indigo-600 truncate mt-1" title={cafe.link}>
                        <a
                          href={cafe.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {truncateText(cafe.link, 30)}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => onEditCafe(cafe)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteCafe(cafe._id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-sm text-gray-700 flex-1 min-w-0">
                  <span className="font-medium text-gray-900">Address: </span>
                  <span title={cafe.address}>{truncateText(cafe.address, 40)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Phone: </span>
                  {cafe.phone}
                </div>
              </div>

              {cafe.location && (
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div className="text-sm text-gray-700 flex-1 min-w-0">
                    <span className="font-medium text-gray-900">Location: </span>
                    <span title={cafe.location}>{truncateText(cafe.location, 35)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <button
                onClick={() => onShowProducts(cafe)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Products ({cafe.products?.length || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CafesTable;