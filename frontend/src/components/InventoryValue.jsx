import { useEffect, useState } from 'react';
import { getInventoryValue } from '../services/api';

function InventoryValue() {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadValue = async () => {
      setLoading(true);
      try {
        const data = await getInventoryValue();
        if (active) {
          setValue(data.totalInventoryValue ?? 0);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError('Cannot fetch inventory value yet. Make sure backend is running.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadValue();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="inventory-value-card glass-panel">
      <div className="inventory-value-header">
        <span className="badge">Total Inventory</span>
      </div>
      <div className="inventory-value-body">
        <p className="muted">Total inventory value</p>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <h2 className="inventory-value">₹ {value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        )}
      </div>
    </div>
  );
}

export default InventoryValue;
