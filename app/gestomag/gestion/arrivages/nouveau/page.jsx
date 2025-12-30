'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { arrivalService } from '../../../services/arrivalService';
import { supplierService } from '../../../services/supplierService';
import { productService } from '../../../services/productService';

export default function ArrivalForm() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    supplierId: ''
  });
  const [lines, setLines] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [suppliersData, productsData] = await Promise.all([
      supplierService.getAll(),
      productService.getAll()
    ]);
    setSuppliers(suppliersData);
    setProducts(productsData);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addLine = () => {
    setLines([...lines, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateLine = (index, field, value) => {
    const newLines = [...lines];
    newLines[index][field] = value;

    if (field === 'productId' && value) {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        newLines[index].unitPrice = product.price;
      }
    }

    setLines(newLines);
  };

  const removeLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierId) {
      alert('Veuillez sélectionner un fournisseur');
      return;
    }
    if (lines.length === 0) {
      alert('Veuillez ajouter au moins une ligne');
      return;
    }
    if (lines.some(l => !l.productId || l.quantity <= 0)) {
      alert('Veuillez compléter toutes les lignes');
      return;
    }

    setLoading(true);
    try {
      await arrivalService.create({
        ...form,
        lines
      });
      router.push('/gestomag/gestion/arrivages');
    } catch (error) {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/gestomag/gestion/arrivages" className="gmBtn gmBtn--ghost">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="gestomag__title">Nouvel Arrivage</h1>
        </div>
      </header>

      <form className="gmForm" onSubmit={handleSubmit}>
        <section className="gmForm__section">
          <h3 className="gmForm__sectionTitle">Informations Générales</h3>
          <div className="gmForm__grid gmForm__grid--3">
            <div className="gmForm__group">
              <label className="gmForm__label">Date *</label>
              <input
                type="date"
                name="date"
                className="gmForm__input"
                value={form.date}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Référence</label>
              <input
                type="text"
                name="reference"
                className="gmForm__input"
                value={form.reference}
                onChange={handleFormChange}
                placeholder="BL-001"
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Fournisseur *</label>
              <select
                name="supplierId"
                className="gmForm__select"
                value={form.supplierId}
                onChange={handleFormChange}
                required
              >
                <option value="">Sélectionner...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="gmForm__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="gmForm__sectionTitle" style={{ margin: 0, border: 'none', padding: 0 }}>
              Lignes d'arrivage
            </h3>
            <button type="button" className="gmBtn gmBtn--secondary" onClick={addLine}>
              <Plus size={18} />
              <span>Ajouter ligne</span>
            </button>
          </div>

          {lines.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
              Aucune ligne. Cliquez sur "Ajouter ligne" pour commencer.
            </p>
          ) : (
            <div className="gmTable">
              <table className="gmTable__table">
                <thead>
                  <tr>
                    <th className="gmTable__th">Produit</th>
                    <th className="gmTable__th">Quantité</th>
                    <th className="gmTable__th">Prix Unitaire</th>
                    <th className="gmTable__th">Total</th>
                    <th className="gmTable__th"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index} className="gmTable__tr">
                      <td className="gmTable__td">
                        <select
                          className="gmForm__select"
                          value={line.productId}
                          onChange={(e) => updateLine(index, 'productId', e.target.value)}
                          required
                        >
                          <option value="">Sélectionner...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.ref} - {p.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="gmTable__td">
                        <input
                          type="number"
                          className="gmForm__input"
                          value={line.quantity}
                          onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value) || 0)}
                          min="1"
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td className="gmTable__td">
                        <input
                          type="number"
                          className="gmForm__input"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          style={{ width: '100px' }}
                        />
                      </td>
                      <td className="gmTable__td">
                        {(line.quantity * line.unitPrice).toFixed(2)} €
                      </td>
                      <td className="gmTable__td">
                        <button
                          type="button"
                          className="gmBtn gmBtn--icon gmBtn--icon--delete"
                          onClick={() => removeLine(index)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="gmTable__td" colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total :
                    </td>
                    <td className="gmTable__td" style={{ fontWeight: 'bold' }}>
                      {calculateTotal().toFixed(2)} €
                    </td>
                    <td className="gmTable__td"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        <footer className="gmForm__actions">
          <Link href="/gestomag/gestion/arrivages" className="gmBtn gmBtn--secondary">
            Annuler
          </Link>
          <button type="submit" className="gmBtn gmBtn--primary" disabled={loading}>
            {loading ? 'Création...' : 'Créer l\'arrivage'}
          </button>
        </footer>
      </form>
    </article>
  );
}
