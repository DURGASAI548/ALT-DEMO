import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { clearSession, createSalesOrder, fetchBrands, fetchCustomerAddresses, fetchCustomers, fetchOrderFormData, fetchProducts, fetchVendors, getSession, login } from './api';

const products = [
  { id: 1, name: 'Halo Pendant', type: 'Pendant lighting', price: 12900, image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=85', tag: 'New' },
  { id: 2, name: 'Linea Floor Lamp', type: 'Floor lighting', price: 18900, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85', tag: 'Bestseller' },
  { id: 3, name: 'Orbit Table Lamp', type: 'Table lighting', price: 7500, image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=900&q=85', tag: 'New' },
  { id: 4, name: 'Arc Wall Light', type: 'Wall lighting', price: 5400, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=85', tag: '' },
  { id: 5, name: 'Solace Chandelier', type: 'Chandeliers', price: 24900, image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=85', tag: 'New' },
  { id: 6, name: 'Muse Sconce', type: 'Wall lighting', price: 6800, image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=85', tag: '' }
];

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

function Header({ page, setPage, cart, session, onLogout }) {
  const [open, setOpen] = useState(false);
  const go = (target) => { setPage(target); setOpen(false); window.scrollTo(0, 0); };
  return <>
    <header className="header"><button className="brand" onClick={() => go('home')}><span>ALT</span>LIGHTS</button>
      <nav className={open ? 'nav open' : 'nav'}><button onClick={() => go('shop')}>Shop</button><button onClick={() => go('products')}>Products</button><button onClick={() => go('customers')}>Customers</button><button onClick={() => go('vendors')}>Vendors</button><button onClick={() => go('orders')}>Orders</button><button onClick={() => go('about')}>Our story</button><button onClick={() => go('contact')}>Contact</button></nav>
      <div className="header-actions"><button className="search-icon" aria-label="Search">⌕</button>{session ? <button className="account" onClick={onLogout} title="Sign out">{session.data.profile?.name?.split(' ')[0] || 'Account'} <small>Sign out</small></button> : <button className="account" onClick={() => go('login')}>Login</button>}<button className="bag" onClick={() => go('cart')} aria-label="Shopping bag">Bag <b>{cart.length}</b></button><button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">☰</button></div>
    </header>
  </>;
}

function ProductCard({ item, addToCart, setPage, setSelected }) {
  return <article className="product-card"><button className="product-image" onClick={() => { setSelected(item); setPage('product'); window.scrollTo(0, 0); }}><img src={item.image} alt={item.name}/>{item.tag && <span>{item.tag}</span>}</button><div className="product-info"><div><p>{item.type}</p><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><button className="add" onClick={() => addToCart(item)} aria-label={`Add ${item.name} to bag`}>+</button></div></article>;
}

function Home({ addToCart, setPage, setSelected }) {
  return <main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">Light, beautifully considered</p><h1>Bring your<br/><em>home</em> to life.</h1><p className="hero-text">Thoughtfully designed lighting for all the little moments that make a house your own.</p><button className="button light" onClick={() => setPage('shop')}>Explore the collection <i>→</i></button></div><img src="https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=1600&q=90" alt="Warmly lit room"/></section>
    <section className="intro section"><p className="eyebrow red">Made for real living</p><h2>Good light changes<br/>everything.</h2><p>We believe every room deserves to feel as good as it looks. From a quiet reading corner to a table full of friends, our lights are made to make you feel at home.</p><button className="text-link" onClick={() => setPage('about')}>Our approach <i>→</i></button></section>
    <section className="featured section"><div className="section-title"><div><p className="eyebrow red">The favourites</p><h2>Most loved lights</h2></div><button className="text-link" onClick={() => setPage('shop')}>View all <i>→</i></button></div><div className="product-grid">{products.slice(0, 3).map(item => <ProductCard key={item.id} item={item} {...{ addToCart, setPage, setSelected }}/>)}</div></section>
    <section className="statement"><img src="https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1500&q=85" alt="Contemporary interior"/><div><p className="eyebrow">The ALT difference</p><h2>Made to last.<br/><em>Made to matter.</em></h2><p>Timeless forms, honest materials and a warm, welcoming glow—designed in India for homes everywhere.</p><button className="button light" onClick={() => setPage('about')}>Why ALTLIGHTS <i>→</i></button></div></section>
    <section className="newsletter"><p className="eyebrow red">A little brighter, every now and then</p><h2>Join our world.</h2><p>News, new arrivals and ideas for a well-lit life.</p><form onSubmit={e => e.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Email address"/><button>Subscribe →</button></form></section>
  </main>;
}

function Shop({ addToCart, setPage, setSelected }) { const [filter, setFilter] = useState('All'); const types = ['All', 'Pendant lighting', 'Floor lighting', 'Table lighting', 'Wall lighting', 'Chandeliers']; const shown = filter === 'All' ? products : products.filter(p => p.type === filter); return <main className="shop-page section"><p className="eyebrow red">The collection</p><h1>Find your light.</h1><div className="filters">{types.map(type => <button className={filter === type ? 'active' : ''} key={type} onClick={() => setFilter(type)}>{type.replace(' lighting','')}</button>)}</div><div className="product-grid all-products">{shown.map(item => <ProductCard key={item.id} item={item} {...{ addToCart, setPage, setSelected }}/>)}</div></main>; }

function Product({ item, addToCart, setPage }) { return <main className="product-page section"><button className="back" onClick={() => setPage('shop')}>← Back to collection</button><div className="product-detail"><div className="detail-image"><img src={item.image} alt={item.name}/></div><div className="detail-copy"><p className="eyebrow red">{item.type}</p><h1>{item.name}</h1><p className="price">{money(item.price)}</p><p>Designed to cast a beautiful, comfortable glow. This considered piece brings character and warmth to everyday spaces.</p><div className="swatches"><span className="gold"></span><span className="black"></span><span className="white"></span></div><button className="button red-button" onClick={() => addToCart(item)}>Add to bag <i>→</i></button><div className="perks"><p>✓ Complimentary shipping</p><p>✓ 2-year warranty</p><p>✓ Easy 14-day returns</p></div></div></div></main>; }

function About({ setPage }) { return <main><section className="story-hero"><div><p className="eyebrow red">Our story</p><h1>Light is more<br/>than what you see.</h1><p>It is how a room feels. How a memory begins. How you make a place your own.</p></div><img src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85" alt="Interior detail"/></section><section className="intro section"><p className="eyebrow red">Thoughtfully made</p><h2>For the everyday<br/>and everything in it.</h2><p>ALTLIGHTS began with a simple belief: beautiful, well-made lighting should feel within reach. We make pieces that are quietly confident, enduringly useful and a joy to live with.</p><button className="text-link" onClick={() => setPage('shop')}>Explore our lights <i>→</i></button></section></main>; }

function Contact() { return <main className="contact section"><p className="eyebrow red">We are here to help</p><h1>Let’s talk light.</h1><div className="contact-grid"><div><h2>Visit us</h2><p>Monday — Saturday<br/>10 am — 7 pm IST</p><h2>Say hello</h2><p>hello@altlights.in<br/>+91 98765 43210</p></div><form onSubmit={e => e.preventDefault()}><label>Name<input placeholder="Your name"/></label><label>Email<input type="email" placeholder="you@example.com"/></label><label>How can we help?<textarea placeholder="Tell us a little more..." rows="5"/></label><button className="button red-button">Send message <i>→</i></button></form></div></main>; }

function Login({ onSuccess, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { const session = await login({ email, password }); onSuccess(session); setPage('home'); window.scrollTo(0, 0); }
    catch (reason) { setError(reason.message || 'Unable to sign in.'); }
    finally { setLoading(false); }
  };
  return <main className="login-page"><section className="login-panel"><button className="brand" onClick={() => setPage('home')}><span>ALT</span>LIGHTS</button><div className="login-copy"><p className="eyebrow red">Welcome back</p><h1>Sign in to your<br/><em>account.</em></h1><p>Manage your account and discover lighting designed for your everyday.</p></div></section><section className="login-form-wrap"><form className="login-form" onSubmit={submit}><p className="eyebrow red">Account access</p><h2>Good to see you.</h2><p className="form-intro">Enter your details to continue.</p>{error && <p className="login-error" role="alert">{error}</p>}<label>Email address<input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" required/></label><label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Your password" autoComplete="current-password" required/></label><button className="button red-button" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <i>→</i></>}</button><button type="button" className="return-link" onClick={() => setPage('home')}>← Continue as guest</button></form></section></main>;
}

function Products({ setPage }) {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [visible, setVisible] = useState(24);
  const [search, setSearch] = useState('');
  const [brandId, setBrandId] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [orderProduct, setOrderProduct] = useState(null);
  useEffect(() => {
    let active = true;
    Promise.all([fetchProducts(), fetchBrands()]).then(([products, returnedBrands]) => { if (active) { setItems(products); setBrands(returnedBrands); setStatus('ready'); } })
      .catch((reason) => { if (active) { setError(reason.message || 'Products could not be loaded.'); setStatus('error'); } });
    return () => { active = false; };
  }, []);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesBrand = !brandId || item.brand_id === brandId;
      const matchesSearch = !query || [item.variation_name, item.sku, item.brand, item.category].some((value) => value?.toLowerCase().includes(query));
      return matchesBrand && matchesSearch;
    });
  }, [items, search, brandId]);
  const imageUrl = (item) => item.image ? `https://altlights.sixorbit.com${item.image}` : '';
  if (status === 'loading') return <main className="products-page section"><p className="eyebrow red">Inventory catalogue</p><h1>Products.</h1><div className="loading-state"><span></span><p>Loading your products…</p></div></main>;
  if (status === 'error') return <main className="products-page section"><p className="eyebrow red">Inventory catalogue</p><h1>Products.</h1><div className="error-state"><p>{error}</p><button className="button red-button" onClick={() => setPage('login')}>Sign in <i>→</i></button></div></main>;
  return <main className="products-page section"><p className="eyebrow red">Inventory catalogue</p><div className="products-heading"><div><h1>Products.</h1><p>{filtered.length.toLocaleString('en-IN')} of {items.length.toLocaleString('en-IN')} products</p></div><div className="catalogue-filters"><select value={brandId} onChange={e => { setBrandId(e.target.value); setVisible(24); }} aria-label="Filter by brand"><option value="">All brands</option>{brands.map(brand => <option key={brand.bid} value={brand.bid}>{brand.name}</option>)}</select><input className="product-search" value={search} onChange={e => { setSearch(e.target.value); setVisible(24); }} placeholder="Search name, SKU, brand…" aria-label="Search products"/></div></div><div className="inventory-table"><div className="inventory-row inventory-header"><span>Product</span><span>SKU</span><span>Category</span><span>Brand</span><span>Price</span><span>Status</span><span></span></div>{filtered.slice(0, visible).map(item => <div className="inventory-row" key={item.isvid}><div className="inventory-product">{imageUrl(item) ? <img src={imageUrl(item)} alt=""/> : <span className="product-placeholder">ALT</span>}<strong>{item.variation_name || item.item_name}</strong></div><span>{item.sku || '—'}</span><span>{item.category || '—'}</span><span>{item.brand || '—'}</span><strong>{Number(item.mrp || item.price || 0) ? money(Number(item.mrp || item.price)) : '—'}</strong><span className={item.status_name === 'Active' ? 'status active-status' : 'status'}>{item.status_name || '—'}</span><button className="order-button" onClick={() => setOrderProduct(item)}>Create order</button></div>)}</div>{!filtered.length && <p className="no-products">No products match your selected filter.</p>}{visible < filtered.length && <button className="load-more" onClick={() => setVisible(current => current + 24)}>Load 24 more <i>→</i></button>}{orderProduct && <SalesOrderModal product={orderProduct} onClose={() => setOrderProduct(null)}/>}</main>;
}

function SalesOrderModal({ product, onClose }) {
  const [customers, setCustomers] = useState([]); const [formData, setFormData] = useState(null); const [addresses, setAddresses] = useState([]);
  const [customerId, setCustomerId] = useState(''); const [said, setSaid] = useState(''); const [chkid, setChkid] = useState(''); const [paymentMode, setPaymentMode] = useState(''); const [taxId, setTaxId] = useState('0');
  const [quantity, setQuantity] = useState('1'); const [discount, setDiscount] = useState('0'); const [advanceAmount, setAdvanceAmount] = useState('0'); const [remarks, setRemarks] = useState(''); const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('loading'); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  useEffect(() => { let active = true; Promise.all([fetchCustomers(), fetchOrderFormData()]).then(([returnedCustomers, returnedForm]) => { if (active) { setCustomers(returnedCustomers); setFormData(returnedForm); setChkid(returnedForm.order_form_data?.outlet?.[0]?.id || ''); setStatus('ready'); } }).catch(reason => { if (active) { setError(reason.message || 'Order details could not be loaded.'); setStatus('error'); } }); return () => { active = false; }; }, []);
  useEffect(() => { if (!customerId) { setAddresses([]); setSaid(''); return; } let active = true; setAddresses([]); setSaid(''); fetchCustomerAddresses(customerId).then(data => { if (active) { setAddresses(data); setSaid(data[0]?.said || ''); } }).catch(reason => { if (active) setError(reason.message || 'Addresses could not be loaded.'); }); return () => { active = false; }; }, [customerId]);
  const selectedCustomer = customers.find(customer => customer.cuid === customerId); const selectedAddress = addresses.find(address => address.said === said); const selectedOutlet = formData?.order_form_data?.outlet?.find(outlet => outlet.id === chkid); const price = Number(product.mrp || product.price || 0); const total = Math.max(0, price * Number(quantity || 0) * (1 - Number(discount || 0) / 100));
  const submit = async event => { event.preventDefault(); if (!selectedCustomer || !said || !selectedAddress?.state || !chkid || !selectedOutlet?.sale_alid) { setError('Select a customer address with a state, and an outlet with a sales ledger before submitting.'); return; } if (Number(advanceAmount) > 0 && !paymentMode) { setError('Select an advance payment method before submitting.'); return; } setError(''); setStatus('submitting'); const payload = { bit: 1, cuid: Number(selectedCustomer.cuid), said: Number(said), baid: Number(said), chkid: Number(chkid), alid: Number(selectedOutlet.sale_alid), uid: Number(getSession()?.data?.user_id || 0), order_type: 1, create_date: deliveryDate, delivery_date: deliveryDate, checkpoint_order_remarks: remarks, discount: Number(discount || 0), pre_charge: [], post_charge: [], attributes: '[]', mail: 0, sms: 0, cart: [{ isvid: Number(product.isvid), type: 1, name: product.variation_name || product.item_name, quantity: Number(quantity), meaid: product.meaid ? Number(product.meaid) : undefined, price: 6000.00, price_meaid: product.meaid ? Number(product.meaid) : undefined, butapid: taxId === '0' ? undefined : Number(taxId), discount: 0, discount_type: 1, roundoff: 0, item_service: Number(product.item_service || 0), remark: '' }] }; if (Number(advanceAmount) > 0) { payload.advance_payment = 1; payload.advance_amount = Number(advanceAmount); payload.payment_mode = Number(paymentMode); payload.payment_attrs = '[]'; } try { const response = await createSalesOrder(payload); setSuccess(response.message || 'Sales order created successfully.'); setStatus('ready'); } catch (reason) { setError(reason.message || 'The sales order could not be created.'); setStatus('ready'); } };
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="sales-order-modal" role="dialog" aria-modal="true" aria-labelledby="sales-order-title" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close sales order">×</button><p className="eyebrow red">Create sales order</p><h2 id="sales-order-title">{product.variation_name || product.item_name}</h2>{status === 'loading' && <div className="modal-loading"><span></span><p>Preparing the sales order…</p></div>}{status === 'error' && <p className="modal-error">{error}</p>}{status !== 'loading' && status !== 'error' && <form className="sales-order-form" onSubmit={submit}>{success && <p className="order-success">{success}</p>}{error && <p className="modal-error">{error}</p>}<div className="order-product-line"><span>Unit price</span><strong>{money(price)}</strong><span>Product ID</span><strong>{product.isvid}</strong></div><label>Customer<select value={customerId} onChange={e => setCustomerId(e.target.value)} required><option value="">Select customer</option>{customers.map(customer => <option key={customer.cuid} value={customer.cuid}>{customer.company_name || customer.cust_name} · #{customer.customer_number}</option>)}</select></label><label>Delivery & billing address<select value={said} onChange={e => setSaid(e.target.value)} disabled={!customerId || !addresses.length} required><option value="">{customerId ? 'Select address' : 'Select a customer first'}</option>{addresses.map(address => <option key={address.said} value={address.said}>{[address.line1, address.city, address.zipCode].filter(Boolean).join(', ')}</option>)}</select></label><div className="order-fields"><label>Outlet<select value={chkid} onChange={e => setChkid(e.target.value)} required>{formData?.order_form_data?.outlet?.map(outlet => <option key={outlet.id} value={outlet.id}>{outlet.name}</option>)}</select></label><label>Advance payment method<select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}><option value="">Select if taking advance</option>{formData?.order_form_data?.paymentModeData?.map(payment => <option key={payment.cpoid} value={payment.cpoid}>{payment.name}</option>)}</select></label><label>Tax<select value={taxId} onChange={e => setTaxId(e.target.value)}><option value="0">No tax</option>{formData?.tax_list?.map(tax => <option key={tax.butapid} value={tax.butapid}>{tax.name}</option>)}</select></label><label>Delivery date<input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required/></label><label>Quantity<input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required/></label><label>Order discount (%)<input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} /></label><label>Advance amount<input type="number" min="0" value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} /></label></div><label>Order remarks<textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows="3" placeholder="Optional remarks"/></label><div className="order-total"><span>Order total</span><strong>{money(total)}</strong></div><p className="order-note">The payload follows the documented minimal order format. The selected customer address is used for both shipping (<code>said</code>) and billing (<code>baid</code>).</p><button className="button red-button" disabled={status === 'submitting'}>{status === 'submitting' ? 'Creating order…' : <>Create sales order <i>→</i></>}</button></form>}</section></div>;
}

function Customers({ setPage }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [addressModal, setAddressModal] = useState(null);
  useEffect(() => {
    let active = true;
    fetchCustomers().then((returnedCustomers) => { if (active) { setCustomers(returnedCustomers); setStatus('ready'); } })
      .catch((reason) => { if (active) { setError(reason.message || 'Customers could not be loaded.'); setStatus('error'); } });
    return () => { active = false; };
  }, []);
  const shownCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter(customer => [customer.cust_name, customer.company_name, customer.customer_number, customer.mobile, customer.email, customer.gstin].some(value => value?.toLowerCase().includes(query)));
  }, [customers, search]);
  const customerName = (customer) => customer.company_name || customer.cust_name || `${customer.fname || ''} ${customer.lname || ''}`.trim() || 'Unnamed customer';
  const type = (customer) => customer.customer_type === '1' ? 'Business' : 'Individual';
  const showAddresses = async (customer) => {
    setAddressModal({ customer, status: 'loading', addresses: [], error: '' });
    try {
      const addresses = await fetchCustomerAddresses(customer.cuid);
      setAddressModal(current => current?.customer.cuid === customer.cuid ? { customer, status: 'ready', addresses, error: '' } : current);
    } catch (reason) {
      setAddressModal(current => current?.customer.cuid === customer.cuid ? { customer, status: 'error', addresses: [], error: reason.message || 'Addresses could not be loaded.' } : current);
    }
  };
  if (status === 'loading') return <main className="customers-page section"><p className="eyebrow red">Customer directory</p><h1>Customers.</h1><div className="loading-state"><span></span><p>Loading customer details…</p></div></main>;
  if (status === 'error') return <main className="customers-page section"><p className="eyebrow red">Customer directory</p><h1>Customers.</h1><div className="error-state"><p>{error}</p><button className="button red-button" onClick={() => setPage('login')}>Sign in <i>→</i></button></div></main>;
  return <main className="customers-page section"><p className="eyebrow red">Customer directory</p><div className="customers-heading"><div><h1>Customers.</h1><p>{customers.length} recent customers</p></div><input className="customer-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, number, mobile…" aria-label="Search customers"/></div><div className="customer-grid">{shownCustomers.map(customer => <article className="customer-card" key={customer.cuid}><div className="customer-card-heading"><span className="customer-avatar">{customerName(customer).slice(0, 1).toUpperCase()}</span><div><h2>{customerName(customer)}</h2><p>Customer #{customer.customer_number || '—'}</p></div><span className="customer-type">{type(customer)}</span></div><div className="customer-details"><p><b>Mobile</b>{customer.mobile || '—'}</p><p><b>Email</b>{customer.email || '—'}</p><p><b>GSTIN</b>{customer.gstin || '—'}</p><p><b>Address</b>{customer.address || '—'}</p></div><div className="customer-card-footer"><span>{customer.custatusid === '1' ? 'Active' : 'Inactive'}</span><button onClick={() => showAddresses(customer)}>View addresses →</button><strong>{Number(customer.wallet_balance || 0) ? money(Number(customer.wallet_balance)) : 'No wallet balance'}</strong></div></article>)}</div>{!shownCustomers.length && <p className="no-products">No customers match “{search}”.</p>}{addressModal && <div className="modal-backdrop" role="presentation" onMouseDown={() => setAddressModal(null)}><section className="address-modal" role="dialog" aria-modal="true" aria-labelledby="addresses-title" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={() => setAddressModal(null)} aria-label="Close addresses">×</button><p className="eyebrow red">Customer addresses</p><h2 id="addresses-title">{customerName(addressModal.customer)}</h2>{addressModal.status === 'loading' && <div className="modal-loading"><span></span><p>Loading addresses…</p></div>}{addressModal.status === 'error' && <p className="modal-error">{addressModal.error}</p>}{addressModal.status === 'ready' && (addressModal.addresses.length ? <div className="address-list">{addressModal.addresses.map(address => <article className="address-item" key={address.said}><span className="address-pin">⌖</span><div><h3>{[address.firstName, address.lastName].filter(Boolean).join(' ') || address.siteName || 'Address'}</h3><p>{[address.line1, address.line2, address.area, address.city, address.state, address.country, address.zipCode].filter(Boolean).join(', ')}</p>{address.phone_no && <small>{address.phone_no}</small>}</div></article>)}</div> : <p className="no-addresses">No saved addresses for this customer.</p>)}</section></div>}</main>;
}

function Orders({ setPage }) {
  const [orderData, setOrderData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetchOrderFormData().then(data => { if (active) { setOrderData(data); setStatus('ready'); } })
      .catch(reason => { if (active) { setError(reason.message || 'Order data could not be loaded.'); setStatus('error'); } });
    return () => { active = false; };
  }, []);
  if (status === 'loading') return <main className="orders-page section"><p className="eyebrow red">Order workspace</p><h1>Orders.</h1><div className="loading-state"><span></span><p>Loading order form data…</p></div></main>;
  if (status === 'error') return <main className="orders-page section"><p className="eyebrow red">Order workspace</p><h1>Orders.</h1><div className="error-state"><p>{error}</p><button className="button red-button" onClick={() => setPage('login')}>Sign in <i>→</i></button></div></main>;
  const form = orderData.order_form_data || {};
  const outlets = form.outlet || [];
  const salesTypes = form.customer_sales_types || [];
  const payments = form.paymentModeData || [];
  const taxes = orderData.tax_list || [];
  const charges = orderData.charges_list || [];
  return <main className="orders-page section"><p className="eyebrow red">Order workspace</p><div className="orders-heading"><div><h1>Orders.</h1><p>Order form settings from your account.</p></div><div className="delivery-date"><span>Delivery date</span><strong>{orderData.delivery_date || '—'}</strong></div></div><div className="order-summary"><div><span>Outlets</span><strong>{outlets.length}</strong></div><div><span>Sales types</span><strong>{salesTypes.length}</strong></div><div><span>Payment methods</span><strong>{payments.length}</strong></div><div><span>Tax rates</span><strong>{taxes.length}</strong></div></div><div className="order-columns"><section className="order-section"><h2>Order details</h2><label>Outlet<select>{outlets.map(outlet => <option key={outlet.id} value={outlet.id}>{outlet.name}</option>)}</select></label><label>Customer sales type<select>{salesTypes.map(type => <option key={type.custid} value={type.custid}>{type.name}</option>)}</select></label><div className="sales-account"><span>Sales account</span><strong>{form.ledgerInfo?.name || '—'}</strong></div></section><section className="order-section"><h2>Available payment methods</h2><div className="tag-list">{payments.map(payment => <span key={payment.cpoid}>{payment.name}</span>)}</div></section><section className="order-section"><h2>Tax & charges</h2><div className="tax-list">{taxes.map(tax => <div key={tax.butapid}><span>{tax.name}</span><strong>{Number(tax.value)}%</strong></div>)}{charges.map(charge => <div key={charge.ecid}><span>{charge.title}</span><strong>Charge</strong></div>)}</div></section></div></main>;
}

function Vendors({ setPage }) {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('I');
  const [requestedSearch, setRequestedSearch] = useState('I');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setStatus('loading'); setError('');
    fetchVendors(requestedSearch).then(data => { if (active) { setVendors(data); setStatus('ready'); } })
      .catch(reason => { if (active) { setError(reason.message || 'Vendors could not be loaded.'); setStatus('error'); } });
    return () => { active = false; };
  }, [requestedSearch]);
  const submitSearch = (event) => { event.preventDefault(); setRequestedSearch(search); };
  const address = (vendor) => vendor.c_address || [vendor.address_line_1, vendor.address_line_2, vendor.c_city].filter(Boolean).join(', ');
  if (status === 'loading' && !vendors.length) return <main className="vendors-page section"><p className="eyebrow red">Supplier directory</p><h1>Vendors.</h1><div className="loading-state"><span></span><p>Loading vendor details…</p></div></main>;
  if (status === 'error') return <main className="vendors-page section"><p className="eyebrow red">Supplier directory</p><h1>Vendors.</h1><div className="error-state"><p>{error}</p><button className="button red-button" onClick={() => setPage('login')}>Sign in <i>→</i></button></div></main>;
  return <main className="vendors-page section"><p className="eyebrow red">Supplier directory</p><div className="vendors-heading"><div><h1>Vendors.</h1><p>{vendors.length} results for “{requestedSearch || 'all vendors'}”</p></div><form onSubmit={submitSearch}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors…" aria-label="Search vendors"/><button disabled={status === 'loading'}>{status === 'loading' ? 'Searching…' : 'Search →'}</button></form></div><div className="vendor-grid">{vendors.map(vendor => <article className="vendor-card" key={vendor.venid}><div className="vendor-card-heading"><span className="vendor-avatar">{vendor.name?.slice(0, 1) || 'V'}</span><div><h2>{vendor.name || 'Unnamed vendor'}</h2><p>Vendor #{vendor.vendor_number || '—'}</p></div><span className={vendor.registered === '2' ? 'vendor-status active-vendor' : 'vendor-status'}>{vendor.registered === '2' ? 'Registered' : 'Unregistered'}</span></div><div className="vendor-details"><p><b>Mobile</b>{vendor.mobile || '—'}</p><p><b>Email</b>{vendor.vendor_email || '—'}</p><p><b>GSTIN</b>{vendor.gstin || '—'}</p><p><b>PAN</b>{vendor.pan || '—'}</p><p className="vendor-address"><b>Address</b>{address(vendor) || '—'}</p></div><div className="vendor-card-footer"><span>{vendor.tax_type || 'Tax details unavailable'}</span><strong>{Number(vendor.credit_limit || 0) ? money(Number(vendor.credit_limit)) : 'No credit limit'}</strong></div></article>)}</div>{!vendors.length && <p className="no-products">No vendors found for “{requestedSearch}”.</p>}</main>;
}

function Cart({ cart, setCart, setPage }) { const total = cart.reduce((sum, p) => sum + p.price, 0); return <main className="cart section"><p className="eyebrow red">Your selection</p><h1>Your bag.</h1>{cart.length ? <><div className="cart-list">{cart.map((item, i) => <div className="cart-item" key={`${item.id}-${i}`}><img src={item.image} alt=""/><div><h3>{item.name}</h3><p>{item.type}</p><strong>{money(item.price)}</strong></div><button onClick={() => setCart(cart.filter((_, index) => index !== i))}>Remove</button></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong><button className="button red-button">Proceed to checkout <i>→</i></button></div></> : <div className="empty"><p>Your bag is waiting for its first beautiful light.</p><button className="button red-button" onClick={() => setPage('shop')}>Explore collection <i>→</i></button></div>}</main>; }

function Footer({ setPage }) { return <footer><div className="footer-top"><button className="brand" onClick={() => setPage('home')}><span>ALT</span>LIGHTS</button><p>Better light for a<br/>better way of living.</p><div><button onClick={() => setPage('shop')}>Shop</button><button onClick={() => setPage('about')}>Our story</button><button onClick={() => setPage('contact')}>Contact</button></div></div><div className="footer-bottom"><span>© 2025 ALTLIGHTS</span><span>Designed for everyday life</span></div></footer> }

function App() { const [page, setPage] = useState('home'); const [cart, setCart] = useState([]); const [selected, setSelected] = useState(products[0]); const [session, setSession] = useState(() => getSession()); const addToCart = (item) => setCart(current => [...current, item]); const logout = () => { clearSession(); setSession(null); setPage('home'); }; useEffect(() => { document.title = `${page === 'home' ? 'ALTLIGHTS' : page[0].toUpperCase()+page.slice(1)} — ALTLIGHTS`; }, [page]); const props = { setPage, addToCart, setSelected }; const pages = { home: <Home {...props}/>, shop: <Shop {...props}/>, product: <Product item={selected} {...props}/>, about: <About {...props}/>, contact: <Contact/>, cart: <Cart cart={cart} setCart={setCart} setPage={setPage}/>, login: <Login setPage={setPage} onSuccess={setSession}/>, products: <Products setPage={setPage}/>, customers: <Customers setPage={setPage}/>, vendors: <Vendors setPage={setPage}/>, orders: <Orders setPage={setPage}/> }; return <><Header page={page} setPage={setPage} cart={cart} session={session} onLogout={logout}/>{pages[page]}{page !== 'login' && <Footer setPage={setPage}/>}</> }

createRoot(document.getElementById('root')).render(<App />);
