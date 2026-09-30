import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import api from "./api";

const categories = ["All", "Electronics", "Fashion", "Shoes", "Home", "Accessories"];

function Header({ user, cartCount, logout }) {
  const navigate = useNavigate();
  return (
    <header className="header">
      <Link className="logo" to="/">
        <span>PM</span> Prarabdh Store
      </Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        {user && <Link to="/orders">My Orders</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        <Link className="cart-link" to="/cart">Cart ({cartCount})</Link>
        {user ? (
          <button className="nav-btn" onClick={logout}>Logout</button>
        ) : (
          <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>
    </header>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">WELCOME TO PRARABDH STORE</p>
          <h1>Everything you need.<br /><span>One simple store.</span></h1>
          <p>Shop electronics, fashion, shoes, home products and accessories at Prarabdh Store.</p>
          <button onClick={() => navigate("/products")}>Shop Now →</button>
        </div>
        <div className="hero-card">
          <div className="hero-circle">PM</div>
          <h3>Prarabdh Store</h3>
          <p>Quality • Value • Convenience</p>
        </div>
      </section>
      <section className="section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.slice(1).map(c => (
            <Link key={c} to={`/products?category=${c}`} className="category-card">
              <div>{c === "Electronics" ? "⚡" : c === "Fashion" ? "👕" : c === "Shoes" ? "👟" : c === "Home" ? "🏠" : "🎒"}</div>
              <h3>{c}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const load = async () => {
    const { data } = await api.get("/products", { params: { search, category } });
    setProducts(data);
  };

  useEffect(() => { load(); }, [category]);

  return (
    <main className="section">
      <div className="page-title">
        <div>
          <p className="eyebrow">PRARABDH STORE</p>
          <h1>Products</h1>
        </div>
        <input
          className="search"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === "Enter" && load()}
        />
      </div>
      <div className="filters">
        {categories.map(c => (
          <button key={c} className={category === c ? "filter active" : "filter"} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {products.map(p => (
          <div className="product-card" key={p._id}>
            <Link to={`/products/${p._id}`}><img src={p.image} alt={p.name} /></Link>
            <div className="product-info">
              <small>{p.category}</small>
              <Link to={`/products/${p._id}`}><h3>{p.name}</h3></Link>
              <p className="desc">{p.description}</p>
              <div className="product-bottom">
                <strong>₹{p.price.toLocaleString("en-IN")}</strong>
                <button disabled={p.stock === 0} onClick={() => addToCart(p)}>
                  {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!products.length && <div className="empty">No products found.</div>}
    </main>
  );
}

function ProductDetails({ addToCart }) {
  const [product, setProduct] = useState(null);
  const id = useLocation().pathname.split("/").pop();

  useEffect(() => { api.get(`/products/${id}`).then(r => setProduct(r.data)); }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <main className="section details">
      <img src={product.image} alt={product.name} />
      <div>
        <small>{product.category} • {product.brand}</small>
        <h1>{product.name}</h1>
        <p className="detail-price">₹{product.price.toLocaleString("en-IN")}</p>
        <p>{product.description}</p>
        <p><b>Stock:</b> {product.stock}</p>
        <button disabled={!product.stock} onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </main>
  );
}

function Auth({ type, setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/auth/${type}`, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand-mark">PM</div>
        <h1>{type === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p>{type === "login" ? "Login to your Prarabdh Store account." : "Join Prarabdh Store today."}</p>
        {type === "register" && (
          <input placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
        )}
        <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Password" required minLength="6" value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        {error && <div className="error">{error}</div>}
        <button type="submit">{type === "login" ? "Login" : "Register"}</button>
        <p className="switch">{type === "login" ? <>New here? <Link to="/register">Create account</Link></> : <>Already registered? <Link to="/login">Login</Link></>}</p>
      </form>
    </main>
  );
}

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const update = (id, qty) => {
    if (qty < 1) return setCart(cart.filter(x => x._id !== id));
    setCart(cart.map(x => x._id === id ? {...x, quantity: qty} : x));
  };
  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  return (
    <main className="section">
      <h1>Your Cart</h1>
      {!cart.length ? (
        <div className="empty"><h2>Your cart is empty</h2><button onClick={() => navigate("/products")}>Start Shopping</button></div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map(x => (
              <div className="cart-item" key={x._id}>
                <img src={x.image} alt={x.name} />
                <div className="cart-info">
                  <h3>{x.name}</h3>
                  <p>₹{x.price.toLocaleString("en-IN")}</p>
                  <div className="quantity">
                    <button onClick={() => update(x._id, x.quantity - 1)}>−</button>
                    <span>{x.quantity}</span>
                    <button onClick={() => update(x._id, x.quantity + 1)}>+</button>
                  </div>
                </div>
                <strong>₹{(x.price*x.quantity).toLocaleString("en-IN")}</strong>
              </div>
            ))}
          </div>
          <div className="summary">
            <h2>Order Summary</h2>
            <div><span>Subtotal</span><b>₹{total.toLocaleString("en-IN")}</b></div>
            <div><span>Delivery</span><b>FREE</b></div>
            <hr />
            <div className="grand"><span>Total</span><b>₹{total.toLocaleString("en-IN")}</b></div>
            <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </main>
  );
}

function Checkout({ cart, setCart, user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:user?.name || "", phone:"", address:"", city:"", pincode:"" });
  const [error, setError] = useState("");
  const total = cart.reduce((s,x) => s + x.price*x.quantity, 0);

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post("/orders", {
        items: cart.map(x => ({ product:x._id, quantity:x.quantity })),
        shippingAddress: form,
        paymentMethod: "Cash on Delivery"
      });
      setCart([]);
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    }
  };

  if (!user) return <div className="empty">Please login to checkout.</div>;
  if (!cart.length) return <div className="empty">Your cart is empty.</div>;

  return (
    <main className="section checkout">
      <div>
        <h1>Checkout</h1>
        <form className="checkout-form" onSubmit={submit}>
          <input required placeholder="Full Name" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/>
          <input required placeholder="Phone Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
          <textarea required placeholder="Complete Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
          <input required placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
          <input required placeholder="Pincode" value={form.pincode} onChange={e=>setForm({...form,pincode:e.target.value})}/>
          {error && <div className="error">{error}</div>}
          <button>Place Order — ₹{total.toLocaleString("en-IN")}</button>
        </form>
      </div>
      <div className="summary">
        <h2>Payment</h2>
        <p>Cash on Delivery</p>
        <p className="muted">Demo checkout. No real payment is charged.</p>
      </div>
    </main>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get("/orders/my").then(r=>setOrders(r.data)); }, []);
  return (
    <main className="section">
      <h1>My Orders</h1>
      {!orders.length && <div className="empty">You have no orders yet.</div>}
      <div className="orders">
        {orders.map(o => (
          <div className="order-card" key={o._id}>
            <div><b>Order #{o._id.slice(-8).toUpperCase()}</b><span>{new Date(o.createdAt).toLocaleString()}</span></div>
            {o.items.map(i => <div className="order-product" key={i.product}><img src={i.image}/><span>{i.name} × {i.quantity}</span><b>₹{(i.price*i.quantity).toLocaleString("en-IN")}</b></div>)}
            <div className="order-footer"><span>Status: <b>{o.status}</b></span><strong>Total: ₹{o.totalAmount.toLocaleString("en-IN")}</strong></div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Admin() {
  const [products,setProducts]=useState([]);
  const [orders,setOrders]=useState([]);
  const empty={name:"",description:"",price:"",image:"",category:"Electronics",stock:"",brand:"Prarabdh Store"};
  const [form,setForm]=useState(empty);
  const [editing,setEditing]=useState(null);

  const load=async()=>{
    const [p,o]=await Promise.all([api.get("/products"),api.get("/orders")]);
    setProducts(p.data); setOrders(o.data);
  };
  useEffect(()=>{load()},[]);

  const save=async e=>{
    e.preventDefault();
    if(editing) await api.put(`/products/${editing}`,form);
    else await api.post("/products",form);
    setForm(empty); setEditing(null); load();
  };

  const edit=p=>{setEditing(p._id);setForm({...p});};
  const del=async id=>{if(confirm("Delete this product?")){await api.delete(`/products/${id}`);load()}};
  const status=async(id,value)=>{await api.put(`/orders/${id}/status`,{status:value});load()};

  return (
    <main className="section admin">
      <div className="page-title"><div><p className="eyebrow">ADMIN PANEL</p><h1>Prarabdh Store Dashboard</h1></div></div>
      <div className="admin-grid">
        <form className="admin-form" onSubmit={save}>
          <h2>{editing ? "Edit Product" : "Add Product"}</h2>
          <input required placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <textarea required placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <input required type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
          <input required placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select>
          <input required type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/>
          <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/>
          <button>{editing ? "Update Product" : "Add Product"}</button>
          {editing && <button type="button" className="secondary" onClick={()=>{setEditing(null);setForm(empty)}}>Cancel</button>}
        </form>
        <div>
          <h2>Products</h2>
          <div className="admin-list">{products.map(p=><div className="admin-row" key={p._id}><img src={p.image}/><div><b>{p.name}</b><small>₹{p.price} • Stock {p.stock}</small></div><button onClick={()=>edit(p)}>Edit</button><button className="danger" onClick={()=>del(p._id)}>Delete</button></div>)}</div>
        </div>
      </div>
      <h2 className="admin-orders-title">All Orders</h2>
      <div className="orders">
        {orders.map(o=><div className="order-card" key={o._id}><div><b>{o.user?.name}</b><span>{o.user?.email}</span></div><div className="order-footer"><span>₹{o.totalAmount.toLocaleString("en-IN")}</span><select value={o.status} onChange={e=>status(o._id,e.target.value)}>{["Placed","Processing","Shipped","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></div></div>)}
      </div>
    </main>
  );
}

export default function App() {
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem("user")||"null"));
  const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem("cart")||"[]"));

  useEffect(()=>localStorage.setItem("cart",JSON.stringify(cart)),[cart]);

  const addToCart = p => {
    setCart(c => {
      const found=c.find(x=>x._id===p._id);
      if(found) return c.map(x=>x._id===p._id?{...x,quantity:Math.min(x.quantity+1,p.stock)}:x);
      return [...c,{...p,quantity:1}];
    });
    alert("Added to cart");
  };

  const logout=()=>{localStorage.removeItem("token");localStorage.removeItem("user");setUser(null)};

  return <>
    <Header user={user} cartCount={cart.reduce((s,x)=>s+x.quantity,0)} logout={logout}/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/products" element={<Products addToCart={addToCart}/>}/>
      <Route path="/products/:id" element={<ProductDetails addToCart={addToCart}/>}/>
      <Route path="/login" element={<Auth type="login" setUser={setUser}/>}/>
      <Route path="/register" element={<Auth type="register" setUser={setUser}/>}/>
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>}/>
      <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} user={user}/>}/>
      <Route path="/orders" element={<Orders/>}/>
      <Route path="/admin" element={user?.role==="admin"?<Admin/>:<div className="empty"><h2>Admin access required</h2></div>}/>
    </Routes>
    <footer>© {new Date().getFullYear()} <b>Prarabdh Mamgain</b> • Prarabdh Store</footer>
  </>;
}
