'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { productService } from '../../services/productService';
import { familyService } from '../../services/familyService';
import { uploadService } from '../../services/uploadService';

export default function ProductEditForm({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    ref: '',
    name: '',
    price: '',
    stock: '0',
    minStock: '0',
    vat: '20',
    familyId: '',
    image: '',
    cloudinaryId: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const [familiesData, product] = await Promise.all([
      familyService.getAll(),
      productService.getById(id)
    ]);

    setFamilies(familiesData);

    if (product) {
      setForm({
        ref: product.ref || '',
        name: product.name || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '0',
        minStock: product.minStock?.toString() || '0',
        vat: product.vat?.toString() || '20',
        familyId: product.familyId?.toString() || '',
        image: product.image || '',
        cloudinaryId: product.cloudinaryId || ''
      });
    }

    setLoadingProduct(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadService.upload(file);
      setForm(prev => ({
        ...prev,
        image: result.url,
        cloudinaryId: result.publicId
      }));
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ref || !form.name || !form.familyId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await productService.update(id, form);
      router.push('/gestomag/produits');
    } catch (error) {
      alert('Erreur lors de la mise à jour du produit');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <article className="gestomag__page">
        <p>Chargement...</p>
      </article>
    );
  }

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/gestomag/produits" className="gmBtn gmBtn--ghost">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="gestomag__title">Modifier le Produit</h1>
        </div>
      </header>

      <form className="gmForm" onSubmit={handleSubmit}>
        <section className="gmForm__section">
          <h3 className="gmForm__sectionTitle">Informations Générales</h3>
          <div className="gmForm__grid gmForm__grid--2">
            <div className="gmForm__group">
              <label className="gmForm__label">Référence *</label>
              <input
                type="text"
                name="ref"
                className="gmForm__input"
                value={form.ref}
                onChange={handleChange}
                required
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Nom *</label>
              <input
                type="text"
                name="name"
                className="gmForm__input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="gmForm__grid gmForm__grid--2">
            <div className="gmForm__group">
              <label className="gmForm__label">Famille *</label>
              <select
                name="familyId"
                className="gmForm__select"
                value={form.familyId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une famille</option>
                {families.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">TVA (%)</label>
              <input
                type="number"
                name="vat"
                className="gmForm__input"
                value={form.vat}
                onChange={handleChange}
                step="0.1"
              />
            </div>
          </div>
        </section>

        <section className="gmForm__section">
          <h3 className="gmForm__sectionTitle">Prix et Stock</h3>
          <div className="gmForm__grid gmForm__grid--3">
            <div className="gmForm__group">
              <label className="gmForm__label">Prix (€)</label>
              <input
                type="number"
                name="price"
                className="gmForm__input"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Stock</label>
              <input
                type="number"
                name="stock"
                className="gmForm__input"
                value={form.stock}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Stock Minimum</label>
              <input
                type="number"
                name="minStock"
                className="gmForm__input"
                value={form.minStock}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </section>

        <section className="gmForm__section">
          <h3 className="gmForm__sectionTitle">Image</h3>
          <div className="gmUpload__zone">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="imageUpload"
            />
            <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
              {uploading ? (
                <p className="gmUpload__text">Upload en cours...</p>
              ) : form.image ? (
                <img src={form.image} alt="Preview" className="gmUpload__preview" />
              ) : (
                <>
                  <Upload size={40} style={{ color: '#64748b', marginBottom: '0.5rem' }} />
                  <p className="gmUpload__text">Cliquez pour sélectionner une image</p>
                </>
              )}
            </label>
          </div>
        </section>

        <footer className="gmForm__actions">
          <Link href="/gestomag/produits" className="gmBtn gmBtn--secondary">
            Annuler
          </Link>
          <button type="submit" className="gmBtn gmBtn--primary" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </footer>
      </form>
    </article>
  );
}
