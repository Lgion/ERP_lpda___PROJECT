'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, Eye } from 'lucide-react';
import { arrivalService } from '../../services/arrivalService';

export default function ArrivalsList() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadArrivals();
  }, []);

  const loadArrivals = async () => {
    setLoading(true);
    const data = await arrivalService.getAll();
    setArrivals(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet arrivage ? Les stocks seront annulés.')) return;
    try {
      await arrivalService.delete(id);
      setArrivals(arrivals.filter(a => a.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const filtered = arrivals.filter(a =>
    (a.reference && a.reference.toLowerCase().includes(search.toLowerCase())) ||
    (a.supplier?.name && a.supplier.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div>
          <h1 className="gestomag__title">Arrivages Stock</h1>
          <p className="gestomag__subtitle">{arrivals.length} arrivage(s)</p>
        </div>
        <Link href="/gestomag/gestion/arrivages/nouveau" className="gmBtn gmBtn--primary">
          <Plus size={20} />
          <span>Nouvel Arrivage</span>
        </Link>
      </header>

      <section className="gmToolbar">
        <div className="gmToolbar__search">
          <Search size={20} className="gmToolbar__icon" />
          <input
            type="text"
            className="gmToolbar__input"
            placeholder="Rechercher par référence ou fournisseur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="gmTable">
        <table className="gmTable__table">
          <thead>
            <tr>
              <th className="gmTable__th">Date</th>
              <th className="gmTable__th">Référence</th>
              <th className="gmTable__th">Fournisseur</th>
              <th className="gmTable__th">Nb Lignes</th>
              <th className="gmTable__th">Montant Total</th>
              <th className="gmTable__th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="gmTable__td" colSpan="6" style={{ textAlign: 'center' }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="gmTable__td" colSpan="6" style={{ textAlign: 'center' }}>
                  Aucun arrivage trouvé
                </td>
              </tr>
            ) : (
              filtered.map((arrival) => (
                <tr key={arrival.id} className="gmTable__tr">
                  <td className="gmTable__td">{formatDate(arrival.date)}</td>
                  <td className="gmTable__td">{arrival.reference || '-'}</td>
                  <td className="gmTable__td">{arrival.supplier?.name || '-'}</td>
                  <td className="gmTable__td">{arrival.lines?.length || 0}</td>
                  <td className="gmTable__td">{arrival.totalAmount.toFixed(2)} €</td>
                  <td className="gmTable__td">
                    <div className="gmTable__actions">
                      <button
                        className="gmBtn gmBtn--icon gmBtn--icon--delete"
                        onClick={() => handleDelete(arrival.id)}
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
