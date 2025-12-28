import { Search, Plus, Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierService, type Supplier } from '../../services/supplierService';

export function SupplierList() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        supplierService.getAll()
            .then(setSuppliers)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
            try {
                await supplierService.delete(id);
                setSuppliers(suppliers.filter(s => s.id !== id));
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
            }
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="page-container"><p>Chargement...</p></div>;
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h2 className="title">Fournisseurs</h2>
                    <p className="subtitle">Gérez vos partenaires commerciaux</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/gestion/fournisseurs/nouveau')}>
                    <Plus size={20} />
                    Nouveau Fournisseur
                </button>
            </header>

            <div className="toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un fournisseur..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Raison Sociale</th>
                            <th>Contact</th>
                            <th>Coordonnées</th>
                            <th>Ville</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted" style={{ padding: '24px' }}>
                                    Aucun fournisseur trouvé
                                </td>
                            </tr>
                        ) : filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id}>
                                <td className="font-bold">{supplier.name}</td>
                                <td>{supplier.contact}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                            <Phone size={14} /> {supplier.phone}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                            <Mail size={14} /> {supplier.email}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} className="text-muted" /> {supplier.city}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="icon-btn" title="Modifier" onClick={() => navigate(`/gestion/fournisseurs/edit/${supplier.id}`)}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete" title="Supprimer" onClick={() => supplier.id && handleDelete(supplier.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
