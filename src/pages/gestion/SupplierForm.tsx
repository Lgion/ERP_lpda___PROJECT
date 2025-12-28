import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierService } from '../../services/supplierService';

export function SupplierForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        phone: '',
        email: '',
        city: ''
    });

    useEffect(() => {
        if (isEditMode && id) {
            supplierService.getById(Number(id)).then(supplier => {
                if (supplier) {
                    setFormData({
                        name: supplier.name,
                        contact: supplier.contact || '',
                        phone: supplier.phone || '',
                        email: supplier.email || '',
                        city: supplier.city || ''
                    });
                }
            });
        }
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode && id) {
                await supplierService.update(Number(id), formData);
            } else {
                await supplierService.create(formData);
            }
            navigate('/gestion/fournisseurs');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="btn-ghost" onClick={() => navigate('/gestion/fournisseurs')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={20} />
                    Retour
                </button>
                <h2 className="title">{isEditMode ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur'}</h2>
            </header>

            <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="card">
                    <h3>Informations Générales</h3>
                    <div className="grid-2">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Raison Sociale *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Nom de l'entreprise"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Principal</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="Nom du contact"
                            />
                        </div>
                        <div className="form-group">
                            <label>Ville</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Téléphone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+225..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-ghost" onClick={() => navigate('/gestion/fournisseurs')}>
                        Annuler
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
                {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{error}</p>}
            </form>
        </div>
    );
}
