import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientService } from '../../services/clientService';

export function ClientForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'Paroisse',
        phone: '',
        city: ''
    });

    useEffect(() => {
        if (isEditMode && id) {
            clientService.getById(Number(id)).then(client => {
                if (client) {
                    setFormData({
                        name: client.name,
                        type: client.type || 'Paroisse',
                        phone: client.phone || '',
                        city: client.city || ''
                    });
                }
            });
        }
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode && id) {
                await clientService.update(Number(id), formData);
            } else {
                await clientService.create(formData);
            }
            navigate('/gestion/clients');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="btn-ghost" onClick={() => navigate('/gestion/clients')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={20} />
                    Retour
                </button>
                <h2 className="title">{isEditMode ? 'Modifier le Client' : 'Nouveau Client'}</h2>
            </header>

            <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="card">
                    <h3>Informations Client</h3>
                    <div className="grid-2">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Nom / Raison Sociale *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Type de Tiers</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="Paroisse">Paroisse</option>
                                <option value="Professionnel">Professionnel (Librairie..)</option>
                                <option value="Groupe">Groupe de Prière</option>
                                <option value="Particulier">Particulier</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ville / Quartier</label>
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
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-ghost" onClick={() => navigate('/gestion/clients')}>
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
