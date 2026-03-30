import { useState, useEffect } from 'react';
import { TrendingUp, Package, BarChart3 } from 'lucide-react';
import { getDashboardAnalytics } from '../services/api';
import { toast } from 'react-hot-toast';

function EnhancedDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardAnalytics();
                setMetrics(data);
            } catch (error) {
                toast.error('Failed to load dashboard metrics');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();

        // Auto-refresh every 10 seconds for a dynamic feel
        const interval = setInterval(fetchMetrics, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !metrics) {
        return (
            <div className="empty-state">
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="dashboard-metrics animate-fade-in">
            <div className="metric-card">
                <div className="metric-header">
                    <div className="metric-label">Total Products</div>
                    <Package size={20} color="var(--primary)" />
                </div>
                <h2 className="metric-value">{metrics.totalProducts}</h2>
            </div>

            <div className="metric-card" style={{ background: 'rgba(6, 95, 70, 0.85)' }}>
                <div className="metric-header">
                    <div className="metric-label">Inventory Value</div>
                    <TrendingUp size={20} color="#22c55e" />
                </div>
                <h2 className="metric-value">
                    ₹ {metrics.totalInventoryValue?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
            </div>

            <div className="metric-card wide">
                <div className="metric-header">
                    <div className="metric-label">Category Inventory Distribution</div>
                </div>
                {metrics.categoryInventory && metrics.categoryInventory.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.7rem' }}>
                        {metrics.categoryInventory.map((cat, idx) => (
                            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid var(--primary)', padding: '0.6rem' }}>
                                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{cat.category}</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                                    ₹ {cat.totalValue?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">No category data yet.</p>
                )}
            </div>
        </div>
    );
}

export default EnhancedDashboard;
