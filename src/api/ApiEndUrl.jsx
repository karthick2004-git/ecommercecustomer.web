const BASE_URL = 'http://localhost:3000/api';

const ApiEndUrl = {
  admin: {
    login: `${BASE_URL}/admin/login`,
    dashboard: `${BASE_URL}/admin/dashboard`,
    products: `${BASE_URL}/admin/products`,
    addProduct: `${BASE_URL}/admin/add-product`,
    updateProduct: `${BASE_URL}/admin/update-product`,
    deleteProduct: `${BASE_URL}/admin/delete-product`,
    orders: `${BASE_URL}/admin/orders`,
    paymentSettings: `${BASE_URL}/admin/payment-settings`,
  },
  customer: {
    register: `${BASE_URL}/customer/register`,
    sendOtp: `${BASE_URL}/customer/send-otp`,
    verifyOtp: `${BASE_URL}/customer/verify-otp`,
    login: `${BASE_URL}/customer/login`,
    products: `${BASE_URL}/customer/products`,
    productDetail: `${BASE_URL}/customer/products/detail`,
    order: `${BASE_URL}/customer/order`,
    orders: `${BASE_URL}/customer/orders`,
  }
};

export default ApiEndUrl;
