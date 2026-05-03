import ApiClientPublic from './ApiClientPublic';
import ApiClientPrivate from './ApiClientPrivate';
import ApiEndUrl from './ApiEndUrl';

const ApiPage = {
  // --- Customer Auth ---
  register: async (data) => {
    return await ApiClientPublic(ApiEndUrl.customer.register, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  sendOtp: async (email) => {
    return await ApiClientPublic(ApiEndUrl.customer.sendOtp, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp: async (email, otp) => {
    return await ApiClientPublic(ApiEndUrl.customer.verifyOtp, {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  login: async (credentials) => {
    return await ApiClientPublic(ApiEndUrl.customer.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // --- Products ---
  fetchProducts: async (category = 'collection', sort = 0) => {
    const url = `${ApiEndUrl.customer.products}?category=${category}&sort=${sort}`;
    return await ApiClientPublic(url);
  },

  fetchProductById: async (id) => {
    const url = `${ApiEndUrl.customer.productDetail}?id=${id}`;
    return await ApiClientPublic(url);
  },

  // --- Orders ---
  placeOrder: async (orderData) => {
    return await ApiClientPrivate(ApiEndUrl.customer.order, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  placeOrderFormData: async (formData) => {
    return await ApiClientPrivate(ApiEndUrl.customer.order, {
      method: 'POST',
      body: formData,
    });
  },

  fetchMyOrders: async () => {
    return await ApiClientPrivate(ApiEndUrl.customer.orders);
  },

  cancelOrder: async (orderId) => {
    return await ApiClientPrivate(ApiEndUrl.customer.order, {
      method: 'PUT',
      body: JSON.stringify({ order_id: orderId }),
    });
  },
  
  fetchPaymentSettings: async () => {
    return await ApiClientPublic(ApiEndUrl.customer.paymentSettings);
  },
};

export default ApiPage;
