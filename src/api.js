const API_URL = 'https://altlights.sixorbit.com/';
const SESSION_KEY = 'altlights.session';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function login({ email, password }) {
  const query = new URLSearchParams({
    urlq: 'service',
    version: '1.0',
    key: '123',
    task: 'login',
    email,
    password,
    app_flag: '2',
    network_ip: '10.0.2.16',
  });

  const response = await fetch(`${API_URL}?${query.toString()}`);
  if (!response.ok) throw new Error('We could not reach the login service. Please try again.');

  const payload = await response.json();
  if (!payload.success || !payload.data?.access_token) {
    throw new Error(payload.message || 'Your email or password is incorrect.');
  }

  // Preserve the complete API response, including token and profile, for later API requests.
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  return payload;
}

// Use this for future endpoints. Extend `params` with the task-specific fields.
export async function authenticatedGet(params = {}, baseUrl = API_URL) {
  const session = getSession();
  if (!session?.data?.access_token) throw new Error('Please sign in before making this request.');

  const query = new URLSearchParams({
    urlq: 'service', version: '1.0', key: '123', access_token: session.data.access_token, ...params,
  });
  const response = await fetch(`${baseUrl}?${query.toString()}`);
  if (!response.ok) throw new Error('The request could not be completed.');
  return response.json();
}

export async function fetchProducts() {
  const session = getSession();
  const userId = session?.data?.user_id;
  const accessToken = session?.data?.access_token;
  if (!userId || !accessToken) throw new Error('Please sign in to view products.');

  const payload = await authenticatedGet({
    task: 'variation/fetch',
    user_id: userId,
    access_token: accessToken,
    last_updated: '',
    limit: '',
    searchtext: '',
    limit_bit: '0',
  });
  if (!payload.success) throw new Error(payload.message || 'Products could not be loaded.');
  return payload.data?.variations || [];
}

export async function fetchBrands() {
  const session = getSession();
  const userId = session?.data?.user_id;
  const accessToken = session?.data?.access_token;
  if (!userId || !accessToken) throw new Error('Please sign in to view brands.');

  const payload = await authenticatedGet({
    task: 'variation/fetch_brand',
    user_id: userId,
    access_token: accessToken,
  });
  if (!payload.success) throw new Error(payload.message || 'Brands could not be loaded.');
  return payload.data?.brand || [];
}

export async function fetchCustomers() {
  const session = getSession();
  const userId = session?.data?.user_id;
  const accessToken = session?.data?.access_token;
  if (!userId || !accessToken) throw new Error('Please sign in to view customers.');

  const payload = await authenticatedGet({
    version: '4.0',
    task: 'customer/fetch',
    user_id: userId,
    access_token: accessToken,
    last_fetch: '',
    traversal: '',
    search: '',
    order_flag: '',
    start_limit: '',
    cno: '',
    default_limit: '10',
  });
  if (!payload.success) throw new Error(payload.message || 'Customers could not be loaded.');
  return payload.data?.customers || [];
}

export async function fetchOrderFormData() {
  const session = getSession();
  const userId = session?.data?.user_id;
  const accessToken = session?.data?.access_token;
  if (!userId || !accessToken) throw new Error('Please sign in to view order data.');

  const payload = await authenticatedGet({
    version: '4.0',
    task: 'chkorder/fetch_order_formData',
    user_id: userId,
    access_token: accessToken,
  });
  if (!payload.success) throw new Error(payload.message || 'Order data could not be loaded.');
  return payload.data || {};
}

export async function fetchVendors(search = 'I') {
  const session = getSession();
  const userId = session?.data?.user_id;
  const accessToken = session?.data?.access_token;
  if (!userId || !accessToken) throw new Error('Please sign in to view vendors.');

  const payload = await authenticatedGet({
    version: '4.0',
    task: 'customer/fetch_vendor',
    user_id: userId,
    access_token: accessToken,
    search,
    network_ip: '192.168.232.2',
  }, 'https://altlights.sixorbit.com/rapidkartprocessadminv2/');
  if (!payload.success) throw new Error(payload.message || 'Vendors could not be loaded.');
  return payload.data?.vendors || [];
}

export async function fetchCustomerAddresses(cuid) {
  const session = getSession();
  const userId = session?.data?.user_id;
  const accessToken = session?.data?.access_token;
  if (!userId || !accessToken) throw new Error('Please sign in to view customer addresses.');

  const payload = await authenticatedGet({
    version: '4.0',
    task: 'customer/customer_address_list',
    user_id: userId,
    access_token: accessToken,
    cuid,
  });
  if (!payload.success) throw new Error(payload.message || 'Customer addresses could not be loaded.');
  return payload.data?.address_list || [];
}

export async function createSalesOrder(orderData) {
  const session = getSession();
  const userId = session?.data?.user_id;
  const accessToken = session?.data?.access_token;
  if (!userId || !accessToken) throw new Error('Please sign in before creating an order.');

  const query = new URLSearchParams({
    urlq: 'service', version: '5.0', key: '123', task: 'chkorder/create_order_submit', user_id: userId, access_token: accessToken,
  });
  const body = new URLSearchParams({ data: JSON.stringify(orderData) });
  const response = await fetch(`${API_URL}?${query.toString()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  });
  if (!response.ok) throw new Error('The sales order could not be submitted.');
  const payload = await response.json();
  if (!payload.success) throw new Error(payload.message || 'The sales order could not be created.');
  return payload;
}
