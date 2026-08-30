import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Download,
  Ellipsis,
  FileText,
  Filter,
  Globe2,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Users,
  X,
} from 'lucide-react';

type View = 'Overview' | 'Orders' | 'Products' | 'Customers' | 'Inventory' | 'Reports';
type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Delivered';
type Language = 'EN' | 'FR' | 'AR';

type Order = {
  id: string;
  customer: string;
  initials: string;
  items: number;
  total: number;
  status: OrderStatus;
  time: string;
  accent: string;
};

type Product = {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  accent: string;
};

const productImages: string[] = [
  'https://images.pexels.com/photos/29168406/pexels-photo-29168406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/28992236/pexels-photo-28992236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/27582699/pexels-photo-27582699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const initialOrders: Order[] = [
  { id: '#ORD-1048', customer: 'Sophie Martin', initials: 'SM', items: 3, total: 84.5, status: 'Preparing', time: '2 min ago', accent: 'sage' },
  { id: '#ORD-1047', customer: 'James Wilson', initials: 'JW', items: 2, total: 46.0, status: 'New', time: '9 min ago', accent: 'clay' },
  { id: '#ORD-1046', customer: 'Amelia Brown', initials: 'AB', items: 5, total: 128.0, status: 'Ready', time: '18 min ago', accent: 'gold' },
  { id: '#ORD-1045', customer: 'Noah Taylor', initials: 'NT', items: 1, total: 24.5, status: 'Delivered', time: '31 min ago', accent: 'blue' },
  { id: '#ORD-1044', customer: 'Olivia Davis', initials: 'OD', items: 4, total: 92.0, status: 'Delivered', time: '48 min ago', accent: 'rose' },
];

const products: Product[] = [
  { name: 'Charred Salmon', category: 'Main course', price: 28, stock: 18, image: productImages[0], accent: 'sage' },
  { name: 'Crispy Garden', category: 'Starters', price: 14, stock: 9, image: productImages[1], accent: 'clay' },
  { name: 'Scallop Garden', category: 'Main course', price: 32, stock: 4, image: productImages[2], accent: 'gold' },
];

const chartValues: number[] = [42, 56, 48, 76, 68, 92, 78, 84, 112, 98, 126, 118, 144, 136, 158, 142, 178, 164, 194, 180, 208, 188, 214, 202];

const copy: Record<Language, Record<string, string>> = {
  EN: { overview: 'Overview', orders: 'Orders', products: 'Products', customers: 'Customers', inventory: 'Inventory', reports: 'Reports', goodMorning: 'Good morning, Camille', subtitle: "Here's what's happening at Eden today.", newOrder: 'New order', viewAll: 'View all orders', recentOrders: 'Recent orders', topProducts: 'Top products', activity: 'Live activity', revenue: 'Revenue', ordersToday: 'Orders today', avgOrder: 'Avg. order value', customersCount: 'Customers', allOrders: 'All orders', search: 'Search anything...', good: 'You are doing great', lowStock: 'Low stock', addProduct: 'Add product', addCustomer: 'Add customer', createOrder: 'Create an order', close: 'Close', language: 'Language', darkMode: 'Dark mode' },
  FR: { overview: 'Vue d’ensemble', orders: 'Commandes', products: 'Produits', customers: 'Clients', inventory: 'Inventaire', reports: 'Rapports', goodMorning: 'Bonjour, Camille', subtitle: "Voici ce qui se passe chez Eden aujourd'hui.", newOrder: 'Nouvelle commande', viewAll: 'Voir toutes les commandes', recentOrders: 'Commandes récentes', topProducts: 'Meilleurs produits', activity: 'Activité en direct', revenue: 'Chiffre d’affaires', ordersToday: 'Commandes du jour', avgOrder: 'Panier moyen', customersCount: 'Clients', allOrders: 'Toutes les commandes', search: 'Rechercher...', good: 'Tout se passe bien', lowStock: 'Stock faible', addProduct: 'Ajouter un produit', addCustomer: 'Ajouter un client', createOrder: 'Créer une commande', close: 'Fermer', language: 'Langue', darkMode: 'Mode sombre' },
  AR: { overview: 'نظرة عامة', orders: 'الطلبات', products: 'المنتجات', customers: 'العملاء', inventory: 'المخزون', reports: 'التقارير', goodMorning: 'صباح الخير، كاميل', subtitle: 'إليك ما يحدث في Eden اليوم.', newOrder: 'طلب جديد', viewAll: 'عرض كل الطلبات', recentOrders: 'الطلبات الأخيرة', topProducts: 'أفضل المنتجات', activity: 'النشاط المباشر', revenue: 'الإيرادات', ordersToday: 'طلبات اليوم', avgOrder: 'متوسط قيمة الطلب', customersCount: 'العملاء', allOrders: 'كل الطلبات', search: 'ابحث عن أي شيء...', good: 'أداء رائع اليوم', lowStock: 'مخزون منخفض', addProduct: 'إضافة منتج', addCustomer: 'إضافة عميل', createOrder: 'إنشاء طلب', close: 'إغلاق', language: 'اللغة', darkMode: 'الوضع الداكن' },
};

function App() {
  const [view, setView] = useState<View>('Overview');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [language, setLanguage] = useState<Language>('EN');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<'order' | 'product' | 'customer' | null>(null);
  const [query, setQuery] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const t = copy[language];

  const filteredOrders = useMemo<Order[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return orders;
    return orders.filter((order: Order) => order.id.toLowerCase().includes(normalizedQuery) || order.customer.toLowerCase().includes(normalizedQuery));
  }, [orders, query]);

  const showNotice = (message: string): void => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const addOrder = (): void => {
    const newOrder: Order = { id: `#ORD-${1050 + orders.length}`, customer: 'Walk-in customer', initials: 'WC', items: 2, total: 38.5, status: 'New', time: 'Just now', accent: 'sage' };
    setOrders((current: Order[]) => [newOrder, ...current]);
    setModal(null);
    showNotice('New order created successfully');
  };

  const advanceOrder = (orderId: string): void => {
    const sequence: OrderStatus[] = ['New', 'Preparing', 'Ready', 'Delivered'];
    setOrders((current: Order[]) => current.map((order: Order) => {
      if (order.id !== orderId) return order;
      const nextStatus: OrderStatus = sequence[Math.min(sequence.indexOf(order.status) + 1, sequence.length - 1)];
      return { ...order, status: nextStatus, time: 'Just now' };
    }));
    showNotice('Order status updated');
  };

  const labels: Record<View, string> = { Overview: t.overview, Orders: t.orders, Products: t.products, Customers: t.customers, Inventory: t.inventory, Reports: t.reports };
  const navigation: Array<{ label: View; icon: typeof LayoutDashboard }> = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Orders', icon: ClipboardList },
    { label: 'Products', icon: Package },
    { label: 'Customers', icon: Users },
    { label: 'Inventory', icon: Boxes },
    { label: 'Reports', icon: FileText },
  ];

  return (
    <div className={darkMode ? 'app-shell dark' : 'app-shell'} dir={language === 'AR' ? 'rtl' : 'ltr'}>
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={18} strokeWidth={2.4} /></div>
          <span className="brand-name">eden<span className="brand-dot">.</span></span>
          <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label={t.close}><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">E</div>
          <div><strong>Eden Restaurant</strong><span>Paris, France</span></div>
          <ChevronDown size={15} className="muted-icon" />
        </div>
        <div className="nav-group">
          <span className="nav-label">Workspace</span>
          {navigation.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${view === label ? 'active' : ''}`} onClick={() => { setView(label); setSidebarOpen(false); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{labels[label]}</span>{label === 'Orders' && <span className="nav-count">5</span>}
            </button>
          ))}
        </div>
        <div className="nav-group secondary-nav">
          <span className="nav-label">Manage</span>
          <button className="nav-item" onClick={() => showNotice('Settings are coming to your workspace')}><Settings size={18} strokeWidth={1.8} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => showNotice('Help center opened')}><Globe2 size={18} strokeWidth={1.8} /><span>Help center</span></button>
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={16} /></div><strong>Make Eden yours</strong><p>Customize your workspace and invite your team.</p><button onClick={() => showNotice('Customization options opened')}>Explore options <ChevronRight size={14} /></button></div>
          <div className="profile-row"><div className="profile-avatar">CM</div><div><strong>Camille Moreau</strong><span>Administrator</span></div><MoreHorizontal size={18} className="muted-icon" /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{labels[view]}</strong></div>
          <div className="top-actions">
            <div className="top-search"><Search size={17} /><input value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder={t.search} /><kbd>⌘ K</kbd></div>
            <div className="language-picker"><Globe2 size={16} /><select value={language} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setLanguage(event.target.value as Language)} aria-label={t.language}><option>EN</option><option>FR</option><option>AR</option></select></div>
            <button className="icon-button" onClick={() => setDarkMode((current: boolean) => !current)} aria-label={t.darkMode}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="notification-button" onClick={() => setNotificationsOpen((current: boolean) => !current)} aria-label="Notifications"><Bell size={19} /><span>3</span></button>
            <div className="top-avatar">CM</div>
          </div>
          {notificationsOpen && <div className="notification-popover"><div className="popover-heading"><strong>Notifications</strong><button onClick={() => setNotificationsOpen(false)}><X size={15} /></button></div><div className="notification-item"><span className="notification-dot green" /><div><strong>New order received</strong><p>Order #ORD-1048 · 2 min ago</p></div></div><div className="notification-item"><span className="notification-dot orange" /><div><strong>Low stock alert</strong><p>Scallop Garden · 4 items left</p></div></div><div className="notification-item"><span className="notification-dot blue" /><div><strong>Payment received</strong><p>Order #ORD-1045 · 31 min ago</p></div></div><button className="popover-footer" onClick={() => showNotice('All notifications marked as read')}>Mark all as read</button></div>}
        </header>

        <div className="page-content">
          {view === 'Overview' && <OverviewPage t={t} onNewOrder={() => setModal('order')} onNavigate={setView} filteredOrders={filteredOrders} onAdvance={advanceOrder} showNotice={showNotice} />}
          {view === 'Orders' && <OrdersPage t={t} orders={filteredOrders} onNewOrder={() => setModal('order')} onAdvance={advanceOrder} />}
          {view === 'Products' && <ProductsPage t={t} onAddProduct={() => setModal('product')} showNotice={showNotice} />}
          {view === 'Customers' && <CustomersPage t={t} onAddCustomer={() => setModal('customer')} showNotice={showNotice} />}
          {view === 'Inventory' && <InventoryPage t={t} showNotice={showNotice} />}
          {view === 'Reports' && <ReportsPage t={t} showNotice={showNotice} />}
        </div>
      </main>

      {modal === 'order' && <ActionModal title={t.createOrder} description="Capture a new order in a few quick steps." submitLabel="Create order" onClose={() => setModal(null)} onSubmit={addOrder} type="order" />}
      {modal === 'product' && <ActionModal title={t.addProduct} description="Add a new item to your restaurant menu." submitLabel="Add product" onClose={() => setModal(null)} onSubmit={() => { setModal(null); showNotice('Product added to your menu'); }} type="product" />}
      {modal === 'customer' && <ActionModal title={t.addCustomer} description="Keep your guest details close at hand." submitLabel="Add customer" onClose={() => setModal(null)} onSubmit={() => { setModal(null); showNotice('Customer added successfully'); }} type="customer" />}
      {notice && <div className="toast"><span className="toast-check"><Check size={15} /></span>{notice}</div>}
    </div>
  );
}

function PageHeading({ title, eyebrow, subtitle, action, onAction }: { title: string; eyebrow: string; subtitle: string; action: string; onAction: () => void }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div><button className="primary-button" onClick={onAction}><Plus size={17} />{action}</button></div>;
}

function OverviewPage({ t, onNewOrder, onNavigate, filteredOrders, onAdvance, showNotice }: { t: Record<string, string>; onNewOrder: () => void; onNavigate: (view: View) => void; filteredOrders: Order[]; onAdvance: (id: string) => void; showNotice: (message: string) => void }) {
  return <>
    <PageHeading eyebrow="Friday, 24 May 2024" title={t.goodMorning} subtitle={t.subtitle} action={t.newOrder} onAction={onNewOrder} />
    <section className="hero-banner"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={14} /> This week at Eden</span><h2>Good food, good business.</h2><p>Your team has served <strong>246 guests</strong> this week. Keep the momentum going.</p><button onClick={() => onNavigate('Reports')}>View weekly report <ArrowUpRight size={16} /></button></div><div className="hero-graphic"><div className="graphic-orbit orbit-one" /><div className="graphic-orbit orbit-two" /><div className="graphic-plate"><div className="plate-garnish" /><span>246</span><small>guests served</small></div></div></section>
    <section className="stat-grid"><StatCard label={t.revenue} value="€ 8,492" trend="12.8%" positive icon={CircleDollarSign} tone="green" detail="vs. last week" /><StatCard label={t.ordersToday} value="128" trend="8.4%" positive icon={ShoppingBag} tone="orange" detail="vs. last week" /><StatCard label={t.avgOrder} value="€ 66.35" trend="3.2%" positive icon={ArrowUpRight} tone="blue" detail="vs. last week" /><StatCard label={t.customersCount} value="1,284" trend="5.7%" positive icon={Users} tone="rose" detail="vs. last week" /></section>
    <section className="dashboard-grid"><div className="panel revenue-panel"><div className="panel-heading"><div><span className="panel-eyebrow">Performance</span><h3>{t.revenue}</h3></div><div className="segmented-control"><button className="selected">Week</button><button>Month</button><button>Year</button></div></div><div className="revenue-number">€ 8,492 <span><ArrowUpRight size={14} /> 12.8%</span></div><RevenueChart /></div><div className="panel status-panel"><div className="panel-heading"><div><span className="panel-eyebrow">Live overview</span><h3>Order status</h3></div><button className="more-button"><Ellipsis size={18} /></button></div><div className="donut-wrap"><div className="donut"><div className="donut-center"><strong>128</strong><span>orders</span></div></div><div className="status-legend"><LegendRow label="Delivered" value="72" color="green" /><LegendRow label="Preparing" value="28" color="orange" /><LegendRow label="New" value="18" color="blue" /><LegendRow label="Ready" value="10" color="gold" /></div></div><div className="status-footer"><span><span className="pulse-dot" /> Live updates on</span><button onClick={() => onNavigate('Orders')}>View orders <ChevronRight size={14} /></button></div></div></section>
    <section className="bottom-grid"><div className="panel orders-panel"><div className="panel-heading"><div><span className="panel-eyebrow">Latest activity</span><h3>{t.recentOrders}</h3></div><button className="text-button" onClick={() => onNavigate('Orders')}>{t.viewAll}<ChevronRight size={15} /></button></div><OrderTable orders={filteredOrders.slice(0, 4)} onAdvance={onAdvance} showNotice={showNotice} /></div><div className="panel products-panel"><div className="panel-heading"><div><span className="panel-eyebrow">Your menu</span><h3>{t.topProducts}</h3></div><button className="more-button"><Ellipsis size={18} /></button></div><div className="product-list">{products.map((product: Product, index: number) => <ProductRow key={product.name} product={product} rank={index + 1} />)}</div><button className="panel-link" onClick={() => onNavigate('Products')}>Manage menu <ArrowUpRight size={15} /></button></div></section>
  </>;
}

function StatCard({ label, value, trend, positive, icon: Icon, tone, detail }: { label: string; value: string; trend: string; positive: boolean; icon: typeof CircleDollarSign; tone: string; detail: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small className={positive ? 'positive' : 'negative'}>{positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{trend} <em>{detail}</em></small></div><button className="more-button"><Ellipsis size={17} /></button></div>;
}

function RevenueChart() {
  const points: string = chartValues.map((value: number, index: number) => `${(index / (chartValues.length - 1)) * 100},${170 - value * 0.76}`).join(' ');
  return <div className="chart-wrap"><div className="chart-y-labels"><span>€ 240</span><span>€ 180</span><span>€ 120</span><span>€ 60</span><span>€ 0</span></div><div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 100 180" preserveAspectRatio="none" className="chart-svg"><defs><linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#a5bd76" stopOpacity=".32" /><stop offset="1" stopColor="#a5bd76" stopOpacity="0" /></linearGradient></defs><polygon points={`0,180 ${points} 100,180`} fill="url(#areaGradient)" /><polyline points={points} fill="none" stroke="#b5cf82" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="chart-tooltip"><strong>€ 214</strong><span>Today, 4:00 PM</span></div><div className="chart-dates"><span>Mon 20</span><span>Tue 21</span><span>Wed 22</span><span>Thu 23</span><span>Fri 24</span></div></div></div>;
}

function LegendRow({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className="legend-row"><span><i className={`legend-dot ${color}`} />{label}</span><strong>{value}</strong></div>;
}

function OrderTable({ orders, onAdvance, showNotice }: { orders: Order[]; onAdvance: (id: string) => void; showNotice: (message: string) => void }) {
  return <div className="order-table"><div className="order-table-head"><span>Order</span><span>Customer</span><span>Items</span><span>Total</span><span>Status</span><span /></div>{orders.map((order: Order) => <div className="order-row" key={order.id}><span className="order-id">{order.id}<small>{order.time}</small></span><span className="customer-cell"><span className={`customer-initial ${order.accent}`}>{order.initials}</span>{order.customer}</span><span>{order.items} items</span><strong>€ {order.total.toFixed(2)}</strong><button className={`status-pill ${order.status.toLowerCase()}`} onClick={() => { onAdvance(order.id); showNotice(`${order.id} moved forward`); }}>{order.status}<ChevronDown size={12} /></button><button className="more-button"><Ellipsis size={17} /></button></div>)}</div>;
}

function ProductRow({ product, rank }: { product: Product; rank: number }) {
  return <div className="product-row"><span className="product-rank">0{rank}</span><img src={product.image} alt={product.name} /><div><strong>{product.name}</strong><span>{product.category}</span></div><strong className="product-price">€ {product.price}</strong></div>;
}

function OrdersPage({ t, orders, onNewOrder, onAdvance }: { t: Record<string, string>; orders: Order[]; onNewOrder: () => void; onAdvance: (id: string) => void }) {
  return <><PageHeading eyebrow="Order management" title={t.allOrders} subtitle="Keep every service moving with a clear view of your floor." action={t.newOrder} onAction={onNewOrder} /><div className="filter-bar"><div className="filter-search"><Search size={17} /><input placeholder="Search by order or customer" /></div><button className="secondary-button"><Filter size={16} /> Filters <span className="filter-badge">2</span></button><button className="secondary-button"><CalendarDays size={16} /> This week <ChevronDown size={14} /></button><button className="secondary-button"><Download size={16} /> Export</button></div><div className="panel full-panel"><OrderTable orders={orders} onAdvance={onAdvance} showNotice={() => undefined} /></div></>;
}

function ProductsPage({ t, onAddProduct, showNotice }: { t: Record<string, string>; onAddProduct: () => void; showNotice: (message: string) => void }) {
  return <><PageHeading eyebrow="Menu management" title={t.products} subtitle="A calm, organized menu keeps the whole team confident." action={t.addProduct} onAction={onAddProduct} /><div className="filter-bar"><div className="filter-search"><Search size={17} /><input placeholder="Search products" /></div><button className="secondary-button"><SlidersHorizontal size={16} /> All categories <ChevronDown size={14} /></button><button className="secondary-button"><Package size={16} /> Stock status <ChevronDown size={14} /></button></div><div className="products-grid">{products.concat({ name: 'Herb Roast Chicken', category: 'Main course', price: 26, stock: 22, image: productImages[0], accent: 'blue' }).map((product: Product) => <div className="menu-card" key={product.name}><div className="menu-card-image"><img src={product.image} alt={product.name} /><span className="menu-badge">Active</span><button className="image-menu"><Ellipsis size={17} /></button></div><div className="menu-card-copy"><div><span>{product.category}</span><h3>{product.name}</h3></div><strong>€ {product.price}</strong></div><div className="stock-line"><span><Package size={14} /> {product.stock} in stock</span><button onClick={() => showNotice(`${product.name} selected for editing`)}>Edit <ChevronRight size={14} /></button></div></div>)}</div></>;
}

function CustomersPage({ t, onAddCustomer, showNotice }: { t: Record<string, string>; onAddCustomer: () => void; showNotice: (message: string) => void }) {
  const customers = [{ name: 'Sophie Martin', email: 'sophie.martin@email.com', orders: 18, spent: '€ 1,248', last: 'Today', initials: 'SM', tone: 'sage' }, { name: 'James Wilson', email: 'james.w@email.com', orders: 12, spent: '€ 846', last: 'Today', initials: 'JW', tone: 'clay' }, { name: 'Amelia Brown', email: 'amelia.b@email.com', orders: 27, spent: '€ 2,104', last: 'Yesterday', initials: 'AB', tone: 'gold' }, { name: 'Noah Taylor', email: 'noah.t@email.com', orders: 6, spent: '€ 324', last: 'Yesterday', initials: 'NT', tone: 'blue' }];
  return <><PageHeading eyebrow="Guest relationships" title={t.customers} subtitle="Know your regulars and make every visit feel personal." action={t.addCustomer} onAction={onAddCustomer} /><div className="customer-highlight"><div className="highlight-icon"><Users size={20} /></div><div><strong>84 returning guests</strong><p>have visited more than once this month</p></div><button onClick={() => showNotice('Customer insights opened')}>View insights <ArrowUpRight size={15} /></button></div><div className="filter-bar"><div className="filter-search"><Search size={17} /><input placeholder="Search customers" /></div><button className="secondary-button"><Filter size={16} /> Filters</button><button className="secondary-button"><Download size={16} /> Export</button></div><div className="panel full-panel customer-table"><div className="customer-head"><span>Customer</span><span>Orders</span><span>Total spent</span><span>Last order</span><span /></div>{customers.map((customer) => <div className="customer-row" key={customer.email}><span className="customer-cell"><span className={`customer-initial ${customer.tone}`}>{customer.initials}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></span><span>{customer.orders}</span><strong>{customer.spent}</strong><span>{customer.last}</span><button className="more-button" onClick={() => showNotice(`${customer.name}'s profile opened`)}><Ellipsis size={17} /></button></div>)}</div></>;
}

function InventoryPage({ t, showNotice }: { t: Record<string, string>; showNotice: (message: string) => void }) {
  const items = [{ name: 'Scallop Garden', category: 'Main course', stock: 4, threshold: 8, status: 'Low stock', tone: 'warning' }, { name: 'Crispy Garden', category: 'Starters', stock: 9, threshold: 8, status: 'Healthy', tone: 'healthy' }, { name: 'Charred Salmon', category: 'Main course', stock: 18, threshold: 8, status: 'Healthy', tone: 'healthy' }, { name: 'Lemon Tart', category: 'Desserts', stock: 0, threshold: 8, status: 'Out of stock', tone: 'danger' }];
  return <><PageHeading eyebrow="Operations" title={t.inventory} subtitle="Stay ahead of the rush with a clear view of what needs attention." action="Adjust stock" onAction={() => showNotice('Stock adjustment opened')} /><div className="inventory-summary"><div><span className="summary-number">31</span><span>total menu items</span></div><div><span className="summary-number warning-text">1</span><span>low stock</span></div><div><span className="summary-number danger-text">1</span><span>out of stock</span></div><div><span className="summary-number">5</span><span>movements today</span></div></div><div className="panel full-panel inventory-table"><div className="inventory-head"><span>Product</span><span>Current stock</span><span>Threshold</span><span>Status</span><span /></div>{items.map((item) => <div className="inventory-row" key={item.name}><span className="customer-cell"><span className="inventory-icon"><Package size={17} /></span><span><strong>{item.name}</strong><small>{item.category}</small></span></span><strong>{item.stock} units</strong><span>{item.threshold} units</span><span className={`inventory-status ${item.tone}`}><i />{item.status}</span><button className="more-button" onClick={() => showNotice(`Stock adjustment opened for ${item.name}`)}><Ellipsis size={17} /></button></div>)}</div></>;
}

function ReportsPage({ t, showNotice }: { t: Record<string, string>; showNotice: (message: string) => void }) {
  return <><PageHeading eyebrow="Business intelligence" title={t.reports} subtitle="Turn your service data into your next good decision." action="Export report" onAction={() => showNotice('Report exported as CSV')} /><div className="report-grid"><div className="panel report-large"><div className="panel-heading"><div><span className="panel-eyebrow">Revenue overview</span><h3>€ 32,840</h3></div><span className="report-trend"><ArrowUpRight size={14} /> 18.4%</span></div><RevenueChart /></div><div className="panel report-list"><div className="panel-heading"><div><span className="panel-eyebrow">Quick reports</span><h3>Explore data</h3></div></div>{['Sales performance', 'Order volume', 'Product performance', 'Customer retention'].map((item: string) => <button className="report-link" key={item} onClick={() => showNotice(`${item} report opened`)}><span className="report-link-icon"><FileText size={16} /></span><span>{item}<small>Updated today</small></span><ArrowUpRight size={16} /></button>)}</div></div></>;
}

function ActionModal({ title, description, submitLabel, onClose, onSubmit, type }: { title: string; description: string; submitLabel: string; onClose: () => void; onSubmit: () => void; type: 'order' | 'product' | 'customer' }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card" onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}><div className="modal-header"><div className="modal-icon"><Plus size={18} /></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><h2>{title}</h2><p>{description}</p><div className="form-grid">{type === 'order' && <><label>Customer<select><option>Walk-in customer</option><option>Sophie Martin</option><option>James Wilson</option></select></label><label>Order type<select><option>Dine-in</option><option>Takeaway</option><option>Delivery</option></select></label></>}{type === 'product' && <><label>Product name<input placeholder="e.g. Herb Roast Chicken" /></label><label>Price<input placeholder="€ 0.00" /></label></>}{type === 'customer' && <><label>Full name<input placeholder="e.g. Camille Moreau" /></label><label>Email address<input placeholder="name@email.com" /></label></>}</div><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={onSubmit}><Check size={16} />{submitLabel}</button></div></div></div>;
}

export default App;
