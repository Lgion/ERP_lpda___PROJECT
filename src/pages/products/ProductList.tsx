import { Search, Plus, Filter, Edit2, Trash2, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { productService } from '../../services/productService';
import type { Product } from '../../services/productService';
import { familyService, type Family } from '../../services/familyService';

export const MOCK_PRODUCTS: Product[] = []; // Typed to avoid never[] inference

interface Filters {
  search: string;
  familyId: string;
  status: string;
  stockFilter: string;
  priceMin: string;
  priceMax: string;
}

const defaultFilters: Filters = {
  search: '',
  familyId: '',
  status: '',
  stockFilter: '',
  priceMin: '',
  priceMax: '',
};

export function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    productService.getAll().then(setProducts);
    familyService.getAll().then(setFamilies);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Recherche textuelle
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.ref.toLowerCase().includes(searchLower) ||
          product.family?.label?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtre par famille
      if (filters.familyId && product.familyId !== Number(filters.familyId)) {
        return false;
      }

      // Filtre par statut
      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Filtre par stock
      if (filters.stockFilter === 'low' && product.stock > product.minStock) {
        return false;
      }
      if (filters.stockFilter === 'zero' && product.stock !== 0) {
        return false;
      }

      // Filtre par prix
      if (filters.priceMin && product.price < Number(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && product.price > Number(filters.priceMax)) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.familyId) count++;
    if (filters.status) count++;
    if (filters.stockFilter) count++;
    if (filters.priceMin || filters.priceMax) count++;
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/produits/edit/${id}`);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h2 className="title">Liste des Produits</h2>
          <p className="subtitle">Gérez votre catalogue produit</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/produits/nouveau')}>
          <Plus size={20} />
          Nouveau Produit
        </button>
      </header>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher par référence, nom..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="actions">
          <button
            className={`btn-secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtrer
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
            <ChevronDown size={16} className={`chevron ${showFilters ? 'rotate' : ''}`} />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Famille</label>
              <select
                value={filters.familyId}
                onChange={(e) => setFilters({ ...filters, familyId: e.target.value })}
              >
                <option value="">Toutes les familles</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Statut</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Tous les statuts</option>
                <option value="available">En stock</option>
                <option value="out_of_stock">Épuisé</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Stock</label>
              <select
                value={filters.stockFilter}
                onChange={(e) => setFilters({ ...filters, stockFilter: e.target.value })}
              >
                <option value="">Tous</option>
                <option value="low">Stock faible (≤ min)</option>
                <option value="zero">Rupture (= 0)</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Prix min (FCFA)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
              />
            </div>

            <div className="filter-group">
              <label>Prix max (FCFA)</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
              />
            </div>

            <div className="filter-group filter-actions">
              <button className="btn-reset" onClick={resetFilters}>
                <X size={16} />
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="filters-summary">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Img</th>
              <th>Référence</th>
              <th>Désignation</th>
              <th>Famille</th>
              <th className="text-right">Prix TTC</th>
              <th className="text-center">Stock</th>
              <th className="text-center">Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={product.image || product.family?.image || '/default.svg'} 
                    alt={product.name} 
                    className="product-thumb" 
                  />
                </td>
                <td className="font-medium">{product.ref}</td>
                <td>{product.name}</td>
                <td>
                  <span className="badge-family">{product.family?.label || 'Sans Famille'}</span>
                </td>
                <td className="text-right">{product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</td>
                <td className="text-center font-medium">{product.stock}</td>
                <td className="text-center">
                  <span className={`status-pill ${product.status}`}>
                    {product.status === 'available' ? 'En Stock' : 'Épuisé'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="action-buttons">
                    <button className="icon-btn" title="Modifier" onClick={() => product.id && handleEdit(product.id)}>
                      <Edit2 size={18} />
                    </button>
                    <button className="icon-btn delete" title="Supprimer" onClick={() => product.id && handleDelete(product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .badge-family {
          background-color: rgba(99, 102, 241, 0.1);
          color: var(--primary-light);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.875rem;
        }

        .status-pill {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-pill.available {
          background-color: rgba(34, 197, 94, 0.1);
          color: var(--success);
        }

        .status-pill.out_of_stock {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .btn-secondary.active {
          background-color: var(--primary);
          color: white;
        }

        .btn-secondary .chevron {
          margin-left: 4px;
          transition: transform 0.2s ease;
        }

        .btn-secondary .chevron.rotate {
          transform: rotate(180deg);
        }

        .filter-badge {
          background-color: var(--primary);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 6px;
        }

        .btn-secondary.active .filter-badge {
          background-color: white;
          color: var(--primary);
        }

        .filters-panel {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-group select,
        .filter-group input {
          padding: 0.6rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          font-size: 0.9rem;
        }

        .filter-group select:focus,
        .filter-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .filter-actions {
          justify-content: flex-end;
        }

        .btn-reset {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .btn-reset:hover {
          background: var(--bg);
          color: var(--error);
          border-color: var(--error);
        }

        .filters-summary {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
