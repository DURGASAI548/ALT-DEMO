import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { clearSession, fetchBrands, fetchProducts, getSession, login } from './api';

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
      <nav className={open ? 'nav open' : 'nav'}><button onClick={() => go('shop')}>Shop</button><button onClick={() => go('products')}>Products</button><button onClick={() => go('about')}>Our story</button><button onClick={() => go('contact')}>Contact</button></nav>
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
  return <main className="products-page section"><p className="eyebrow red">Inventory catalogue</p><div className="products-heading"><div><h1>Products.</h1><p>{filtered.length.toLocaleString('en-IN')} of {items.length.toLocaleString('en-IN')} products</p></div><div className="catalogue-filters"><select value={brandId} onChange={e => { setBrandId(e.target.value); setVisible(24); }} aria-label="Filter by brand"><option value="">All brands</option>{brands.map(brand => <option key={brand.bid} value={brand.bid}>{brand.name}</option>)}</select><input className="product-search" value={search} onChange={e => { setSearch(e.target.value); setVisible(24); }} placeholder="Search name, SKU, brand…" aria-label="Search products"/></div></div><div className="inventory-table"><div className="inventory-row inventory-header"><span>Product</span><span>SKU</span><span>Category</span><span>Brand</span><span>Price</span><span>Status</span></div>{filtered.slice(0, visible).map(item => <div className="inventory-row" key={item.isvid}><div className="inventory-product">{imageUrl(item) ? <img src={imageUrl(item)} alt=""/> : <span className="product-placeholder">ALT</span>}<strong>{item.variation_name || item.item_name}</strong></div><span>{item.sku || '—'}</span><span>{item.category || '—'}</span><span>{item.brand || '—'}</span><strong>{Number(item.mrp || item.price || 0) ? money(Number(item.mrp || item.price)) : '—'}</strong><span className={item.status_name === 'Active' ? 'status active-status' : 'status'}>{item.status_name || '—'}</span></div>)}</div>{!filtered.length && <p className="no-products">No products match your selected filter.</p>}{visible < filtered.length && <button className="load-more" onClick={() => setVisible(current => current + 24)}>Load 24 more <i>→</i></button>}</main>;
}

function Cart({ cart, setCart, setPage }) { const total = cart.reduce((sum, p) => sum + p.price, 0); return <main className="cart section"><p className="eyebrow red">Your selection</p><h1>Your bag.</h1>{cart.length ? <><div className="cart-list">{cart.map((item, i) => <div className="cart-item" key={`${item.id}-${i}`}><img src={item.image} alt=""/><div><h3>{item.name}</h3><p>{item.type}</p><strong>{money(item.price)}</strong></div><button onClick={() => setCart(cart.filter((_, index) => index !== i))}>Remove</button></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>{money(total)}</strong><button className="button red-button">Proceed to checkout <i>→</i></button></div></> : <div className="empty"><p>Your bag is waiting for its first beautiful light.</p><button className="button red-button" onClick={() => setPage('shop')}>Explore collection <i>→</i></button></div>}</main>; }

function Footer({ setPage }) { return <footer><div className="footer-top"><button className="brand" onClick={() => setPage('home')}><span>ALT</span>LIGHTS</button><p>Better light for a<br/>better way of living.</p><div><button onClick={() => setPage('shop')}>Shop</button><button onClick={() => setPage('about')}>Our story</button><button onClick={() => setPage('contact')}>Contact</button></div></div><div className="footer-bottom"><span>© 2025 ALTLIGHTS</span><span>Designed for everyday life</span></div></footer> }

function App() { const [page, setPage] = useState('home'); const [cart, setCart] = useState([]); const [selected, setSelected] = useState(products[0]); const [session, setSession] = useState(() => getSession()); const addToCart = (item) => setCart(current => [...current, item]); const logout = () => { clearSession(); setSession(null); setPage('home'); }; useEffect(() => { document.title = `${page === 'home' ? 'ALTLIGHTS' : page[0].toUpperCase()+page.slice(1)} — ALTLIGHTS`; }, [page]); const props = { setPage, addToCart, setSelected }; const pages = { home: <Home {...props}/>, shop: <Shop {...props}/>, product: <Product item={selected} {...props}/>, about: <About {...props}/>, contact: <Contact/>, cart: <Cart cart={cart} setCart={setCart} setPage={setPage}/>, login: <Login setPage={setPage} onSuccess={setSession}/>, products: <Products setPage={setPage}/> }; return <><Header page={page} setPage={setPage} cart={cart} session={session} onLogout={logout}/>{pages[page]}{page !== 'login' && <Footer setPage={setPage}/>}</> }

createRoot(document.getElementById('root')).render(<App />);
