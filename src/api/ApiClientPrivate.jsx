const ApiClientPrivate = async (url, options = {}) => {
  const token = localStorage.getItem('customer_token');
  
  const defaultOptions = {
    method: 'GET',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_user');
      // Potential redirect or state clear depending on UI
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Customer Private API Error (${url}):`, error.message);
    throw error;
  }
};

export default ApiClientPrivate;
