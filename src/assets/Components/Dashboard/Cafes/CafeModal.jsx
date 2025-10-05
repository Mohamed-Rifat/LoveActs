import React, { useState, useEffect, useRef } from 'react';

const CafeModal = ({
    editingCafe,
    formData,
    submitting,
    onClose,
    onSubmit,
    onInputChange
}) => {
    const modalRef = useRef(null);
    const [products, setProducts] = useState([
        { productName: '', price: '', image: null }
    ]);

    const removeProductField = (index) => {
        const updated = [...products];
        updated.splice(index, 1);
        setProducts(updated);
    };

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onInputChange({
                target: { name: 'image', value: file }
            });
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const handleProductChange = (index, e) => {
        const { name, value, files } = e.target;
        const updated = [...products];
        updated[index][name] = files ? files[0] : value;
        setProducts(updated);
    };

    const handleAddAnotherProduct = () => {
        setProducts([...products, { productName: '', price: '', image: null }]);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 px-3 py-4 sm:px-4 sm:py-6">
            <div
                ref={modalRef}
                className="relative bg-white shadow-2xl max-w-2xl w-full mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                {editingCafe ? 'Edit Cafe' : 'Add New Cafe'}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {editingCafe ? 'Update cafe information' : 'Fill in the cafe details'}
                            </p>
                        </div>
                        <button onClick={onClose} disabled={submitting}
                            className="text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    Cafe Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={onInputChange}
                                    required
                                    disabled={submitting}
                                    placeholder="Enter cafe name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={onInputChange}
                                    required
                                    disabled={submitting}
                                    placeholder="e.g., 0123456789"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label htmlFor="link" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    Website Link *
                                </label>
                                <input
                                    type="url"
                                    id="link"
                                    name="link"
                                    value={formData.link}
                                    onChange={onInputChange}
                                    required
                                    disabled={submitting}
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none  focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={onInputChange}
                                    required
                                    disabled={submitting}
                                    placeholder="Full cafe address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="location" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={onInputChange}
                                    required
                                    disabled={submitting}
                                    placeholder="Area or district name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 sm:pt-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="image" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        Cafe Image
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <label
                                            htmlFor="image"
                                            className={`flex-1 cursor-pointer ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                                                            Click to upload image
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            PNG, JPG, WEBP (Max 5MB)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                disabled={submitting}
                                                className="hidden"
                                            />
                                        </label>
                                        {formData.image && typeof formData.image === 'string' && (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img
                                                    src={formData.image}
                                                    alt="Cafe preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="iframe" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                        Map Embed (Optional)
                                    </label>
                                    <textarea
                                        id="iframe"
                                        name="iframe"
                                        value={formData.iframe}
                                        onChange={onInputChange}
                                        rows="3"
                                        disabled={submitting}
                                        placeholder='&lt;iframe src="..."&gt;&lt;/iframe&gt;'
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 font-mono text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Paste Google Maps embed code here
                                    </p>
                                </div>
                            </div>
                        </div>
                        {!editingCafe && (

                            <div className=" pt-6 mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                    Add Cafe Products
                                </h4>

                                {products.map((product, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-md  mb-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input
                                                type="text"
                                                name="productName"
                                                placeholder="Product Name"
                                                value={product.productName}
                                                onChange={(e) => handleProductChange(index, e)}
                                                className=" px-3 py-2 rounded-lg "
                                                required
                                                disabled={submitting}
                                            />
                                            <input
                                                type="number"
                                                name="price"
                                                placeholder="Price"
                                                min="0"
                                                step="0.01"
                                                value={product.price}
                                                onChange={(e) => handleProductChange(index, e)}
                                                className=" px-3 py-2 rounded-lg"
                                                required
                                                disabled={submitting}
                                            />
                                            <input
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                onChange={(e) => handleProductChange(index, e)}
                                                className="border px-3 py-2 rounded-lg file:mr-3 file:px-4 file:py-2 file:bg-green-100 file:border-0 file:rounded-md file:text-green-700 hover:file:bg-green-200 transition cursor-pointer disabled:opacity-50"
                                                disabled={submitting}
                                            />
                                            {products.length > 1 && (
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

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleAddAnotherProduct}
                                        className="text-sm px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                        disabled={submitting}
                                    >
                                        + Add Another Product
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{editingCafe ? 'Updating...' : 'Adding...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{editingCafe ? 'Update Cafe' : 'Add Cafe'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CafeModal;