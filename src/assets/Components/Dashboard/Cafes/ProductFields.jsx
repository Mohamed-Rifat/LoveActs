import React from 'react';

const ProductFields = ({ products, onProductChange, onAddProduct, onRemoveProduct }) => {
  return (
    <div className="pt-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-900">Products (Optional)</h4>
        <button
          type="button"
          onClick={onAddProduct}
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>

      {products.map((product, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              name="image"
              onChange={(e) => onProductChange(index, e)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={(e) => onProductChange(index, e)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (LE)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={(e) => onProductChange(index, e)}
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            {products.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveProduct(index)}
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
  );
};

export default ProductFields;