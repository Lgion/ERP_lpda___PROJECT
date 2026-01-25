'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, History, Check, X, Pencil } from 'lucide-react';
import { productService } from '../services/productService';
import GmFamilyDropdown from '../../components/gestomag/FamilyDropdown';
import StockHistoryModal from '@/app/components/gestomag/StockHistoryModal';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Stock editing state
  const [editingStockId, setEditingStockId] = useState(null);
  const [editStockValue, setEditStockValue] = useState('');

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historyData, setHistoryData] = useState([]);

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

  const handleStartStockEdit = (product) => {
    setEditingStockId(product.id);
    setEditStockValue(product.stock);
  };

  const handleCancelStockEdit = () => {
    setEditingStockId(null);
    setEditStockValue('');
  };

  const handleSaveStock = async (product) => {
    const newStock = parseInt(editStockValue, 10);
    if (isNaN(newStock)) return;
    if (newStock === product.stock) {
      handleCancelStockEdit();
      return;
    }

    try {
      const updatedProduct = await productService.updateStock(product.id, newStock, 'Ajustement manuel depuis la liste');
      // Update local state
      setProducts(products.map(p => p.id === product.id ? { ...p, stock: updatedProduct.stock, status: updatedProduct.status } : p));
      handleCancelStockEdit();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const handleViewHistory = async (product) => {
    setSelectedProduct(product);
    setHistoryModalOpen(true);
    try {
      const history = await productService.getStockHistory(product.id);
      setHistoryData(history);
    } catch (error) {
      console.error(error);
      alert("Impossible de charger l'historique");
    }
  };

  const handleCloseHistory = () => {
    setHistoryModalOpen(false);
    setSelectedProduct(null);
    setHistoryData([]);
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <GmFamilyDropdown />
          <Link href="/gestomag/produits/nouveau" className="gmBtn gmBtn--primary">
            <Plus size={20} />
            <span>Nouveau Produit</span>
          </Link>
        </div>
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
              <th className="gmTable__th" style={{ minWidth: '150px' }}>Stock</th>
              <th className="gmTable__th">Statut</th>
              <th className="gmTable__th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="gmTable__td" colSpan={8} style={{ textAlign: 'center' }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="gmTable__td" colSpan={8} style={{ textAlign: 'center' }}>
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
                    {editingStockId === product.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input
                          type="number"
                          className="gmForm__input"
                          value={editStockValue}
                          onChange={(e) => setEditStockValue(e.target.value)}
                          style={{ width: '70px', padding: '0.25rem' }}
                          autoFocus
                        />
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#10b981' }}
                          onClick={() => handleSaveStock(product)}
                          title="Valider"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#ef4444' }}
                          onClick={handleCancelStockEdit}
                          title="Annuler"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={product.stock <= product.minStock ? 'gmPill gmPill--warning' : ''}>
                          {product.stock}
                        </span>
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#64748b', opacity: 0.6 }}
                          onClick={() => handleStartStockEdit(product)}
                          title="Modifier le stock"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="gmTable__td">
                    <span className={`gmPill gmPill--${product.status === 'available' ? 'available' : 'outOfStock'}`}>
                      {product.status === 'available' ? 'Disponible' : 'Rupture'}
                    </span>
                  </td>
                  <td className="gmTable__td">
                    <div className="gmTable__actions">
                      <button
                        className="gmBtn gmBtn--icon"
                        onClick={() => handleViewHistory(product)}
                        title="Historique du stock"
                        style={{ color: '#3b82f6' }}
                      >
                        <History size={18} />
                      </button>
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

      <StockHistoryModal
        isOpen={historyModalOpen}
        onClose={handleCloseHistory}
        product={selectedProduct}
        history={historyData}
      />
    </article>
  );
}
