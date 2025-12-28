import { Search, Plus, Calendar, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { arrivalService, type Arrival } from '../../services/arrivalService';

export function ArrivalsList() {
    const navigate = useNavigate();
    const [arrivals, setArrivals] = useState<Arrival[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        arrivalService.getAll()
            .then(setArrivals)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet arrivage ? Le stock sera ajusté.')) {
            try {
                await arrivalService.delete(id);
                setArrivals(arrivals.filter(a => a.id !== id));
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
            }
        }
    };

    if (loading) {
        return <div className="page-container"><p>Chargement...</p></div>;
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h2 className="title">Arrivages Fournisseurs</h2>
                    <p className="subtitle">Historique des entrées de stock</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/gestion/arrivages/nouveau')}>
                    <Plus size={20} />
                    Nouvel Arrivage
                </button>
            </header>

            <div className="toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input type="text" placeholder="Rechercher par n° BL ou fournisseur..." />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Référence BL</th>
                            <th>Fournisseur</th>
                            <th className="text-right">Montant TTC</th>
                            <th className="text-center">Statut</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrivals.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted" style={{ padding: '24px' }}>
                                    Aucun arrivage enregistré
                                </td>
                            </tr>
                        ) : arrivals.map((arrival) => (
                            <tr key={arrival.id}>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} className="text-muted" />
                                        {new Date(arrival.date).toLocaleDateString('fr-FR')}
                                    </span>
                                </td>
                                <td className="font-medium">{arrival.reference}</td>
                                <td>{arrival.supplier?.name || 'N/A'}</td>
                                <td className="text-right font-bold">
                                    {arrival.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                                </td>
                                <td className="text-center">
                                    <span className="status-pill available">Validé</span>
                                </td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="icon-btn" title="Voir détails">
                                            <Eye size={18} />
                                        </button>
                                        <button className="icon-btn delete" title="Supprimer" onClick={() => arrival.id && handleDelete(arrival.id)}>
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
