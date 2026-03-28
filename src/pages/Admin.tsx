import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  Eye,
  IndianRupee,
  LogOut,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import { api, isApiConfigured, type AdminStats, type Order, type Product } from '../lib/api';

const LS_TOKEN = 'snms_admin_token';

// ── Login form ────────────────────────────────────────────────────────────────

const LoginForm = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.adminLogin(email, password);
      localStorage.setItem(LS_TOKEN, res.token);
      onLogin(res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="shiva-card w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🕉️</div>
          <h1 className="text-2xl font-bold text-cyan-400">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">Shree Nandi Marketing Services</p>
        </div>

        {!isApiConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
            Backend API not configured. Set VITE_API_BASE to enable admin features.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(49,46,129,0.5)' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(49,46,129,0.5)' }}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !isApiConfigured}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) => (
  <div className="shiva-card flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-cyan-400"
      style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}
    >
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-cyan-400">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
    </div>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [s, o, p] = await Promise.all([
        api.adminStats(),
        api.adminOrders(),
        api.adminProducts(),
      ]);
      setStats(s);
      setOrders(o);
      setProducts(p);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load data';
      if (msg.includes('Unauthorized') || msg.includes('Invalid')) {
        onLogout();
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 className="h-4 w-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Shree Nandi Marketing Services</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadData()}
            disabled={loading}
            className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={onLogout} className="btn btn-secondary inline-flex items-center gap-2 text-sm">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex gap-1 mb-8 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(49,46,129,0.4)' }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-cyan-400 text-[#0a0a14]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* Overview */}
          {tab === 'overview' && stats && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<Eye className="h-6 w-6" />}
                  label="Total Visitors"
                  value={stats.visitors.total.toLocaleString()}
                  sub={`${stats.visitors.daily} today`}
                />
                <StatCard
                  icon={<ShoppingBag className="h-6 w-6" />}
                  label="Total Orders"
                  value={stats.orders}
                />
                <StatCard
                  icon={<IndianRupee className="h-6 w-6" />}
                  label="Revenue"
                  value={formatINR(stats.revenue)}
                />
                <StatCard
                  icon={<Package className="h-6 w-6" />}
                  label="Active Products"
                  value={stats.products}
                />
              </div>

              {/* Recent orders preview */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Recent Orders
                </h2>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No orders yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b" style={{ borderColor: 'rgba(49,46,129,0.4)' }}>
                          <th className="pb-3 pr-4">Order ID</th>
                          <th className="pb-3 pr-4">Customer</th>
                          <th className="pb-3 pr-4">Amount</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'rgba(49,46,129,0.2)' }}>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 pr-4 font-mono text-xs text-cyan-400">{o.orderId}</td>
                            <td className="py-3 pr-4 text-gray-300">{o.customerName}</td>
                            <td className="py-3 pr-4 text-gray-200">{formatINR(o.amount)}</td>
                            <td className="py-3 pr-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                o.status === 'paid'
                                  ? 'bg-green-500/20 text-green-400'
                                  : o.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 text-gray-500">
                              {new Date(o.createdAt).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-cyan-400" />
                All Orders ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <div className="shiva-card text-center py-12 text-gray-500">
                  No orders found.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="shiva-card">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="font-mono text-xs text-cyan-400 mb-1">{o.orderId}</div>
                          <div className="font-semibold text-white">{o.customerName}</div>
                          <div className="text-sm text-gray-400">{o.customerEmail}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-cyan-400">{formatINR(o.amount)}</div>
                          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                            o.status === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : o.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {o.status}
                          </span>
                          <div className="text-xs text-gray-600 mt-1">
                            {new Date(o.createdAt).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Products */}
          {tab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-cyan-400" />
                  Products ({products.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="shiva-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{p.badge}</span>
                        <h3 className="font-semibold text-white mt-1">{p.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        p.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{p.description}</p>
                    <div className="text-xl font-bold text-cyan-400">
                      {formatINR(p.price)}
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Visitor stats footer */}
      {stats && (
        <div
          className="mt-12 pt-6 flex flex-wrap gap-6 text-sm text-gray-600"
          style={{ borderTop: '1px solid rgba(49,46,129,0.3)' }}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Total unique visitors: {stats.visitors.total.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>Today's visitors: {stats.visitors.daily}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Admin page ────────────────────────────────────────────────────────────────

const Admin = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));

  const handleLogin = (t: string) => setToken(t);

  const handleLogout = () => {
    localStorage.removeItem(LS_TOKEN);
    setToken(null);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
};

export default Admin;
