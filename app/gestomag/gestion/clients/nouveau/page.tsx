'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { clientService } from '../../../services/clientService';

export default function ClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'particulier',
    phone: '',
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
      await clientService.create(form);
      router.push('/gestomag/gestion/clients');
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
          <Link href="/gestomag/gestion/clients" className="gmBtn gmBtn--ghost">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="gestomag__title">Nouveau Client</h1>
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
              <label className="gmForm__label">Type</label>
              <select
                name="type"
                className="gmForm__select"
                value={form.type}
                onChange={handleChange}
              >
                <option value="particulier">Particulier</option>
                <option value="professionnel">Professionnel</option>
                <option value="association">Association</option>
              </select>
            </div>
          </div>

          <div className="gmForm__grid gmForm__grid--2">
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
          <Link href="/gestomag/gestion/clients" className="gmBtn gmBtn--secondary">
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
