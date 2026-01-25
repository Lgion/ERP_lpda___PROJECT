'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supplierService } from '../../../services/supplierService';

export default function SupplierForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    city: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert('Le nom est obligatoire');
      return;
    }

    setLoading(true);
    try {
      await supplierService.create(form);
      router.push('/gestomag/gestion/fournisseurs');
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
          <Link href="/gestomag/gestion/fournisseurs" className="gmBtn gmBtn--ghost">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="gestomag__title">Nouveau Fournisseur</h1>
        </div>
      </header>

      <form className="gmForm" onSubmit={handleSubmit}>
        <section className="gmForm__section">
          <h3 className="gmForm__sectionTitle">Informations</h3>
          <div className="gmForm__grid gmForm__grid--2">
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
            <div className="gmForm__group">
              <label className="gmForm__label">Contact</label>
              <input
                type="text"
                name="contact"
                className="gmForm__input"
                value={form.contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="gmForm__grid gmForm__grid--3">
            <div className="gmForm__group">
              <label className="gmForm__label">Téléphone</label>
              <input
                type="tel"
                name="phone"
                className="gmForm__input"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Email</label>
              <input
                type="email"
                name="email"
                className="gmForm__input"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Ville</label>
              <input
                type="text"
                name="city"
                className="gmForm__input"
                value={form.city}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <footer className="gmForm__actions">
          <Link href="/gestomag/gestion/fournisseurs" className="gmBtn gmBtn--secondary">
            Annuler
          </Link>
          <button type="submit" className="gmBtn gmBtn--primary" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </button>
        </footer>
      </form>
    </article>
  );
}
