import axios from 'axios';

const API_BASE = 'https://flowers-vert-six.vercel.app/api/cart';

const cartApi = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const CartService = {
    getCart: async (token) => {
        try {
            const response = await cartApi.get('/get-user-cart', {
                headers: {
                    'Authorization': `User ${token}`
                }
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Failed to fetch cart';
            console.error('Error in getCart:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    addToCart: async (productId, quantity = 1, token) => {
        try {
            const response = await cartApi.post('/add-to-cart', 
                { productId, quantity },
                {
                    headers: {
                        'Authorization': `User ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Failed to add item to cart';
            console.error('Error in addToCart:', errorMessage);
            throw new Error(errorMessage);
        }
    },

    removeFromCart: async (productId, token) => {
        try {
            const response = await cartApi.patch(`/remove-product-from-cart/${productId}`, 
                { productId },
                {
                    headers: {
                        'Authorization': `User ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Failed to remove item from cart';
            console.error('Error in removeFromCart:', errorMessage);
            throw new Error(errorMessage);
        }
    },
};