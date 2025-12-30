'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { productService } from '../services/productService';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getAll();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.ref.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div>
          <h1 className="gestomag__title">Produits</h1>
          <p className="gestomag__subtitle">{products.length} produit(s) au total</p>
        </div>
        <Link href="/gestomag/produits/nouveau" className="gmBtn gmBtn--primary">
          <Plus size={20} />
          <span>Nouveau Produit</span>
        </Link>
      </header>

      <section className="gmToolbar">
        <div className="gmToolbar__search">
          <Search size={20} className="gmToolbar__icon" />
          <input
            type="text"
            className="gmToolbar__input"
            placeholder="Rechercher par nom ou référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="gmTable">
        <table className="gmTable__table">
          <thead>
            <tr>
              <th className="gmTable__th">Image</th>
              <th className="gmTable__th">Référence</th>
              <th className="gmTable__th">Nom</th>
              <th className="gmTable__th">Famille</th>
              <th className="gmTable__th">Prix</th>
              <th className="gmTable__th">Stock</th>
              <th className="gmTable__th">Statut</th>
              <th className="gmTable__th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="gmTable__td" colSpan="8" style={{ textAlign: 'center' }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="gmTable__td" colSpan="8" style={{ textAlign: 'center' }}>
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="gmTable__tr">
                  <td className="gmTable__td">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="gmTable__thumb" />
                    ) : (
                      <div className="gmTable__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="gmTable__td">{product.ref}</td>
                  <td className="gmTable__td">{product.name}</td>
                  <td className="gmTable__td">
                    {product.family && (
                      <span className="gmBadge">{product.family.label}</span>
                    )}
                  </td>
                  <td className="gmTable__td">{product.price.toFixed(2)} €</td>
                  <td className="gmTable__td">
                    <span className={product.stock <= product.minStock ? 'gmPill gmPill--warning' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="gmTable__td">
                    <span className={`gmPill gmPill--${product.status === 'available' ? 'available' : 'outOfStock'}`}>
                      {product.status === 'available' ? 'Disponible' : 'Rupture'}
                    </span>
                  </td>
                  <td className="gmTable__td">
                    <div className="gmTable__actions">
                      <Link href={`/gestomag/produits/${product.id}`} className="gmBtn gmBtn--icon">
                        <Edit size={18} />
                      </Link>
                      <button
                        className="gmBtn gmBtn--icon gmBtn--icon--delete"
                        onClick={() => handleDelete(product.id)}
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
