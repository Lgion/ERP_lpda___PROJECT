import { Search, Plus, Edit2, Trash2, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService, type Client } from '../../services/clientService';

export function ClientList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        clientService.getAll()
            .then(setClients)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            try {
                await clientService.delete(id);
                setClients(clients.filter(c => c.id !== id));
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
            }
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="page-container"><p>Chargement...</p></div>;
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h2 className="title">Clients</h2>
                    <p className="subtitle">Fichier clients et prospects</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/gestion/clients/nouveau')}>
                    <Plus size={20} />
                    Nouveau Client
                </button>
            </header>

            <div className="toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un client..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nom / Raison Sociale</th>
                            <th>Type</th>
                            <th>Coordonnées</th>
                            <th>Ville</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted" style={{ padding: '24px' }}>
                                    Aucun client trouvé
                                </td>
                            </tr>
                        ) : filteredClients.map((client) => (
                            <tr key={client.id}>
                                <td className="font-bold">{client.name}</td>
                                <td>
                                    <span className="badge-family" style={{ backgroundColor: 'var(--surface-hover)', color: 'var(--text-primary)' }}>
                                        {client.type}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                        <Phone size={14} /> {client.phone}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} className="text-muted" /> {client.city}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="icon-btn" title="Modifier" onClick={() => navigate(`/gestion/clients/edit/${client.id}`)}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete" title="Supprimer" onClick={() => client.id && handleDelete(client.id)}>
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
