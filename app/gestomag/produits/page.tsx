'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, History, Check, X, Pencil, Filter, RotateCcw } from 'lucide-react';
import { productService } from '../services/productService';
import { familyService } from '../services/familyService';
import { uploadService } from '../services/uploadService';
import GmFamilyDropdown from '../../components/gestomag/FamilyDropdown';
import StockHistoryModal from '@/app/components/gestomag/StockHistoryModal';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, available, out_of_stock

  const [priceFilter, setPriceFilter] = useState({
    mode: 'gt', // gt (>) , lt (<), between
    min: '',
    max: ''
  });

  const [stockFilter, setStockFilter] = useState({
    mode: 'gt', // gt (>), lt (<), between
    min: '',
    max: ''
  });

  // Editing state
  type EditingState = {
    id: string;
    field: 'name' | 'price' | 'stock';
  } | null;

  const [editingCell, setEditingCell] = useState<EditingState>(null);
  const [editValue, setEditValue] = useState<string | number>('');

  // Image upload state
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, familiesData] = await Promise.all([
        productService.getAll(),
        familyService.getAll()
      ]);
      setProducts(productsData);
      setFamilies(familiesData);
    } catch (error) {
      console.error(error);
      alert('Erreur lors du chargement des données');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleStartEdit = (product: any, field: 'name' | 'price' | 'stock') => {
    setEditingCell({ id: product.id, field });
    setEditValue(product[field]);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleImageUpload = async (product: any, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    setUploadingImageId(product.id);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadService.upload(file);

      // Update product with new image
      const updatedProduct = await productService.update(product.id, {
        image: uploadResult.url,
        cloudinaryId: uploadResult.publicId
      });

      // Update local state
      setProducts(products.map(p => p.id === product.id ? { ...p, ...updatedProduct } : p));
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImageId(null);
    }
  };

  const handleSaveEdit = async (product: any) => {
    if (!editingCell) return;

    try {
      let updatedProduct;

      if (editingCell.field === 'stock') {
        const newStock = parseInt(editValue.toString(), 10);
        if (isNaN(newStock)) return;
        if (newStock === product.stock) {
          handleCancelEdit();
          return;
        }
        updatedProduct = await productService.updateStock(product.id, newStock, 'Ajustement manuel depuis la liste');
      } else {
        // Name or Price update
        const updates: any = {};
        if (editingCell.field === 'price') {
          const newPrice = parseFloat(editValue.toString());
          if (isNaN(newPrice)) return;
          updates.price = newPrice;
        } else {
          if (!editValue || editValue.toString().trim() === '') return;
          updates.name = editValue;
        }

        // Optimistic update check (avoid api call if no change)
        if (product[editingCell.field] === updates[editingCell.field]) {
          handleCancelEdit();
          return;
        }

        updatedProduct = await productService.update(product.id, updates);
      }

      // Update local state
      setProducts(products.map(p => p.id === product.id ? { ...p, ...updatedProduct } : p));
      handleCancelEdit();

    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleViewHistory = async (product: any) => {
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

  const resetFilters = () => {
    setSearch('');
    setSelectedFamily('');
    setStatusFilter('all');
    setPriceFilter({ mode: 'gt', min: '', max: '' });
    setStockFilter({ mode: 'gt', min: '', max: '' });
  };

  // Filter Logic
  const filtered = products.filter(p => {
    // Text Search
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase());

    // Family Filter
    const matchesFamily = selectedFamily ? (p.family && p.family._id === selectedFamily) : true;

    // Status Filter
    const matchesStatus = statusFilter === 'all'
      ? true
      : statusFilter === 'available'
        ? p.status === 'available'
        : p.status === 'out_of_stock';

    // Price Filter
    const price = p.price || 0;
    const minPrice = parseFloat(priceFilter.min);
    const maxPrice = parseFloat(priceFilter.max);
    let matchesPrice = true;

    if (!isNaN(minPrice)) {
      if (priceFilter.mode === 'gt') matchesPrice = price >= minPrice;
      if (priceFilter.mode === 'lt') matchesPrice = price <= minPrice;
      if (priceFilter.mode === 'between' && !isNaN(maxPrice)) matchesPrice = price >= minPrice && price <= maxPrice;
    }

    // Stock Filter
    const stock = p.stock || 0;
    const minStock = parseFloat(stockFilter.min);
    const maxStock = parseFloat(stockFilter.max);
    let matchesStock = true;

    if (!isNaN(minStock)) {
      if (stockFilter.mode === 'gt') matchesStock = stock >= minStock;
      if (stockFilter.mode === 'lt') matchesStock = stock <= minStock;
      if (stockFilter.mode === 'between' && !isNaN(maxStock)) matchesStock = stock >= minStock && stock <= maxStock;
    }

    return matchesSearch && matchesFamily && matchesStatus && matchesPrice && matchesStock;
  });

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div>
          <h1 className="gestomag__title">Produits</h1>
          <p className="gestomag__subtitle"><b>{filtered.length}</b> produit(s) filtré(s) sur <b>{products.length}</b> au total</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <GmFamilyDropdown />
          <Link href="/gestomag/produits/nouveau" className="gmBtn gmBtn--primary">
            <Plus size={20} />
            <span>Nouveau Produit</span>
          </Link>
        </div>
      </header>

      <section className="gmToolbar" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', height: 'auto', padding: '1rem' }}>

        {/* Row 1: Search & Reset */}
        <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
          <div className="gmToolbar__search" style={{ flex: 1 }}>
            <Search size={20} className="gmToolbar__icon" />
            <input
              type="text"
              className="gmToolbar__input"
              placeholder="Rechercher par nom ou référence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="gmBtn gmBtn--secondary" onClick={resetFilters} title="Réinitialiser les filtres">
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
        </div>

        {/* Row 2: Advanced Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="gmForm__label" style={{ marginBottom: 0 }}>Famille:</label>
            <select
              className="gmForm__select"
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="">Toutes</option>
              {families.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="gmToolbar__separator" style={{ width: '1px', height: '20px', background: '#ccc' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="gmForm__label" style={{ marginBottom: 0 }}>Statut:</label>
            <select
              className="gmForm__select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="all">Tous</option>
              <option value="available">Disponible</option>
              <option value="out_of_stock">Rupture</option>
            </select>
          </div>

          <div className="gmToolbar__separator" style={{ width: '1px', height: '20px', background: '#ccc' }}></div>

          {/* Price Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="gmForm__label" style={{ marginBottom: 0 }}>Prix:</label>
            <select
              className="gmForm__select"
              value={priceFilter.mode}
              onChange={(e) => setPriceFilter({ ...priceFilter, mode: e.target.value })}
            >
              <option value="gt">Supérieur à</option>
              <option value="lt">Inférieur à</option>
              <option value="between">Entre</option>
            </select>
            <input
              type="number"
              className="gmForm__input"
              placeholder={priceFilter.mode === 'between' ? 'Min' : 'Montant'}
              value={priceFilter.min}
              onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
              style={{ width: '80px', padding: '0.25rem' }}
            />
            {priceFilter.mode === 'between' && (
              <input
                type="number"
                className="gmForm__input"
                placeholder="Max"
                value={priceFilter.max}
                onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                style={{ width: '80px', padding: '0.25rem' }}
              />
            )}
          </div>

          <div className="gmToolbar__separator" style={{ width: '1px', height: '20px', background: '#ccc' }}></div>

          {/* Stock Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="gmForm__label" style={{ marginBottom: 0 }}>Stock:</label>
            <select
              className="gmForm__select"
              value={stockFilter.mode}
              onChange={(e) => setStockFilter({ ...stockFilter, mode: e.target.value })}
            >
              <option value="gt">Supérieur à</option>
              <option value="lt">Inférieur à</option>
              <option value="between">Entre</option>
            </select>
            <input
              type="number"
              className="gmForm__input"
              placeholder={stockFilter.mode === 'between' ? 'Min' : 'Qte'}
              value={stockFilter.min}
              onChange={(e) => setStockFilter({ ...stockFilter, min: e.target.value })}
              style={{ width: '80px', padding: '0.25rem' }}
            />
            {stockFilter.mode === 'between' && (
              <input
                type="number"
                className="gmForm__input"
                placeholder="Max"
                value={stockFilter.max}
                onChange={(e) => setStockFilter({ ...stockFilter, max: e.target.value })}
                style={{ width: '80px', padding: '0.25rem' }}
              />
            )}
          </div>

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
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      {uploadingImageId === product.id ? (
                        <div className="gmTable__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          <span style={{ fontSize: '10px' }}>Upload...</span>
                        </div>
                      ) : product.image ? (
                        <img src={product.image} alt={product.name} className="gmTable__thumb" />
                      ) : (
                        <div className="gmTable__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          N/A
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`image-upload-${product.id}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(product, file);
                        }}
                      />
                      <label
                        htmlFor={`image-upload-${product.id}`}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          padding: '2px 4px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          fontSize: '10px',
                          display: uploadingImageId === product.id ? 'none' : 'block'
                        }}
                        title="Modifier l'image"
                      >
                        <Pencil size={10} />
                      </label>
                    </div>
                  </td>
                  <td className="gmTable__td">{product.ref}</td>

                  {/* NAME COLUMN with Edit */}
                  <td className="gmTable__td">
                    {editingCell?.id === product.id && editingCell.field === 'name' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input
                          type="text"
                          className="gmForm__input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{ minWidth: '150px', padding: '0.25rem' }}
                          autoFocus
                        />
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#10b981' }}
                          onClick={() => handleSaveEdit(product)}
                          title="Valider"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#ef4444' }}
                          onClick={handleCancelEdit}
                          title="Annuler"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span title={product.name}>{product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name}</span>
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#64748b', opacity: 0.3 }}
                          onClick={() => handleStartEdit(product, 'name')}
                          title="Modifier le nom"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="gmTable__td">
                    {product.family && (
                      <span className="gmBadge">{product.family.label}</span>
                    )}
                  </td>

                  {/* PRICE COLUMN with Edit */}
                  <td className="gmTable__td">
                    {editingCell?.id === product.id && editingCell.field === 'price' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input
                          type="number"
                          className="gmForm__input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{ width: '80px', padding: '0.25rem' }}
                          autoFocus
                        />
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#10b981' }}
                          onClick={() => handleSaveEdit(product)}
                          title="Valider"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#ef4444' }}
                          onClick={handleCancelEdit}
                          title="Annuler"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{product.price.toFixed(2)} FCFA</span>
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#64748b', opacity: 0.3 }}
                          onClick={() => handleStartEdit(product, 'price')}
                          title="Modifier le prix"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* STOCK COLUMN with Edit */}
                  <td className="gmTable__td">
                    {editingCell?.id === product.id && editingCell.field === 'stock' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input
                          type="number"
                          className="gmForm__input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          style={{ width: '70px', padding: '0.25rem' }}
                          autoFocus
                        />
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#10b981' }}
                          onClick={() => handleSaveEdit(product)}
                          title="Valider"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="gmBtn gmBtn--icon"
                          style={{ color: '#ef4444' }}
                          onClick={handleCancelEdit}
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
                          onClick={() => handleStartEdit(product, 'stock')}
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
