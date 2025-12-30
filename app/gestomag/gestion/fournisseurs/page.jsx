'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supplierService } from '../../services/supplierService';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    const data = await supplierService.getAll();
    setSuppliers(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) return;
    try {
      await supplierService.delete(id);
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (error) {
      alert(error.message || 'Erreur lors de la suppression');
    }
  };

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.city && s.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div>
          <h1 className="gestomag__title">Fournisseurs</h1>
          <p className="gestomag__subtitle">{suppliers.length} fournisseur(s)</p>
        </div>
        <Link href="/gestomag/gestion/fournisseurs/nouveau" className="gmBtn gmBtn--primary">
          <Plus size={20} />
          <span>Nouveau Fournisseur</span>
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
              <th className="gmTable__th">Contact</th>
              <th className="gmTable__th">Téléphone</th>
              <th className="gmTable__th">Email</th>
              <th className="gmTable__th">Ville</th>
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
                  Aucun fournisseur trouvé
                </td>
              </tr>
            ) : (
              filtered.map((supplier) => (
                <tr key={supplier.id} className="gmTable__tr">
                  <td className="gmTable__td">{supplier.name}</td>
                  <td className="gmTable__td">{supplier.contact || '-'}</td>
                  <td className="gmTable__td">{supplier.phone || '-'}</td>
                  <td className="gmTable__td">{supplier.email || '-'}</td>
                  <td className="gmTable__td">{supplier.city || '-'}</td>
                  <td className="gmTable__td">
                    <div className="gmTable__actions">
                      <Link href={`/gestomag/gestion/fournisseurs/${supplier.id}`} className="gmBtn gmBtn--icon">
                        <Edit size={18} />
                      </Link>
                      <button
                        className="gmBtn gmBtn--icon gmBtn--icon--delete"
                        onClick={() => handleDelete(supplier.id)}
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
