'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { clientService } from '../../services/clientService';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    const data = await clientService.getAll();
    setClients(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
    try {
      await clientService.delete(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div>
          <h1 className="gestomag__title">Clients</h1>
          <p className="gestomag__subtitle">{clients.length} client(s)</p>
        </div>
        <Link href="/gestomag/gestion/clients/nouveau" className="gmBtn gmBtn--primary">
          <Plus size={20} />
          <span>Nouveau Client</span>
        </Link>
      </header>

      <section className="gmToolbar">
        <div className="gmToolbar__search">
          <Search size={20} className="gmToolbar__icon" />
          <input
            type="text"
            className="gmToolbar__input"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="gmTable">
        <table className="gmTable__table">
          <thead>
            <tr>
              <th className="gmTable__th">Nom</th>
              <th className="gmTable__th">Type</th>
              <th className="gmTable__th">Téléphone</th>
              <th className="gmTable__th">Ville</th>
              <th className="gmTable__th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="gmTable__td" colSpan="5" style={{ textAlign: 'center' }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="gmTable__td" colSpan="5" style={{ textAlign: 'center' }}>
                  Aucun client trouvé
                </td>
              </tr>
            ) : (
              filtered.map((client) => (
                <tr key={client.id} className="gmTable__tr">
                  <td className="gmTable__td">{client.name}</td>
                  <td className="gmTable__td">
                    <span className="gmBadge">{client.type}</span>
                  </td>
                  <td className="gmTable__td">{client.phone || '-'}</td>
                  <td className="gmTable__td">{client.city || '-'}</td>
                  <td className="gmTable__td">
                    <div className="gmTable__actions">
                      <Link href={`/gestomag/gestion/clients/${client.id}`} className="gmBtn gmBtn--icon">
                        <Edit size={18} />
                      </Link>
                      <button
                        className="gmBtn gmBtn--icon gmBtn--icon--delete"
                        onClick={() => handleDelete(client.id)}
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </article>
  );
}
