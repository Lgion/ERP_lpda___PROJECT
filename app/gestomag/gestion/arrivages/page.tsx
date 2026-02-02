'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { arrivalService } from '../../services/arrivalService';

export default function ArrivalsList() {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
              <th className="gmTable__th" style={{ width: '40px' }}></th>
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
                <td className="gmTable__td" colSpan={7} style={{ textAlign: 'center' }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="gmTable__td" colSpan={7} style={{ textAlign: 'center' }}>
                  Aucun arrivage trouvé
                </td>
              </tr>
            ) : (
              filtered.map((arrival) => (
                <React.Fragment key={arrival.id}>
                  <tr key={arrival.id} className="gmTable__tr">
                    <td className="gmTable__td">
                      <button
                        className="gmBtn gmBtn--icon"
                        onClick={() => toggleExpand(arrival.id)}
                        title={expandedId === arrival.id ? "Masquer les détails" : "Voir les détails"}
                      >
                        {expandedId === arrival.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </td>
                    <td className="gmTable__td">{formatDate(arrival.date)}</td>
                    <td className="gmTable__td">{arrival.reference || '-'}</td>
                    <td className="gmTable__td">{arrival.supplier?.name || '-'}</td>
                    <td className="gmTable__td">{arrival.lines?.length || 0}</td>
                    <td className="gmTable__td">{arrival.totalAmount.toFixed(2)} FCFA</td>
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
                  {expandedId === arrival.id && (
                    <tr className="gmTable__tr--expanded">
                      <td colSpan={7} style={{ padding: 0, backgroundColor: '#f8f9fa' }}>
                        <div style={{ padding: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
                          <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>
                            Détails des produits
                          </h4>
                          {arrival.lines && arrival.lines.length > 0 ? (
                            <table className="gmTable__table">
                              <thead>
                                <tr>
                                  <th className="gmTable__th">Produit</th>
                                  <th className="gmTable__th">Référence</th>
                                  <th className="gmTable__th">Quantité</th>
                                  <th className="gmTable__th">Prix Unitaire</th>
                                  <th className="gmTable__th">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {arrival.lines.map((line: any, index: number) => (
                                  <tr key={index} className="gmTable__tr">
                                    <td className="gmTable__td">{line.product?.name || 'Produit supprimé'}</td>
                                    <td className="gmTable__td">{line.product?.ref || '-'}</td>
                                    <td className="gmTable__td">{line.quantity}</td>
                                    <td className="gmTable__td">{line.unitPrice?.toFixed(2) || '0.00'} FCFA</td>
                                    <td className="gmTable__td">
                                      {((line.quantity || 0) * (line.unitPrice || 0)).toFixed(2)} FCFA
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td className="gmTable__td" colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    Total :
                                  </td>
                                  <td className="gmTable__td" style={{ fontWeight: 'bold' }}>
                                    {arrival.totalAmount.toFixed(2)} FCFA
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          ) : (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
                              Aucun produit dans cet arrivage
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </section>
    </article>
  );
}
