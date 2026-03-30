import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X } from 'lucide-react';
import { getCategories, createCategory, deleteCategory } from '../services/api';
import { toast } from 'react-hot-toast';

function CategoryManagement({ onClose }) {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await createCategory(newCategoryName);
            toast.success('Category created!');
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category? Products might lose their grouping.')) {
            try {
                await deleteCategory(id);
                toast.success('Category removed');
                fetchCategories();
            } catch (error) {
                toast.error('Could not delete category. It might be in use.');
            }
        }
    };

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal glass-panel" style={{ maxWidth: '600px' }}>
                <button className="btn-close" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Tag color="var(--primary)" /> Manage Categories
                </h2>

                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="New Category Name..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary">
                        <Plus size={18} /> Add
                    </button>
                </form>

                <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {loading ? (
                        <p className="text-muted text-center">Loading...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-muted text-center">No categories found.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <span style={{ fontWeight: 500 }}>{cat.name}</span>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="btn btn-ghost"
                                        style={{ color: 'var(--danger)', padding: '0.4rem' }}
                                        title="Delete Category"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryManagement;
