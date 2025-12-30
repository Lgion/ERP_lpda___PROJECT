'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X } from 'lucide-react';
import { familyService } from '../services/familyService';

export default function FamilyList() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ code: '', label: '' });
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ code: '', label: '' });

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    setLoading(true);
    const data = await familyService.getAll();
    setFamilies(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette famille ?')) return;
    try {
      await familyService.delete(id);
      setFamilies(families.filter(f => f.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression. La famille contient peut-être des produits.');
    }
  };

  const startEdit = (family) => {
    setEditingId(family.id);
    setEditForm({ code: family.code, label: family.label });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ code: '', label: '' });
  };

  const saveEdit = async () => {
    if (!editForm.code || !editForm.label) return;
    try {
      const updated = await familyService.update(editingId, editForm);
      setFamilies(families.map(f => f.id === editingId ? { ...f, ...updated } : f));
      cancelEdit();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    if (!newForm.code || !newForm.label) return;
    try {
      const created = await familyService.create(newForm);
      setFamilies([...families, created]);
      setNewForm({ code: '', label: '' });
      setShowNew(false);
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const filtered = families.filter(f =>
    f.code.toLowerCase().includes(search.toLowerCase()) ||
    f.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <div>
          <h1 className="gestomag__title">Familles</h1>
          <p className="gestomag__subtitle">{families.length} famille(s)</p>
        </div>
        <button className="gmBtn gmBtn--primary" onClick={() => setShowNew(true)}>
          <Plus size={20} />
          <span>Nouvelle Famille</span>
        </button>
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

      {showNew && (
        <form className="gmCard" onSubmit={handleNewSubmit}>
          <h3 className="gmCard__title">Nouvelle Famille</h3>
          <div className="gmForm__grid gmForm__grid--2">
            <div className="gmForm__group">
              <label className="gmForm__label">Code</label>
              <input
                type="text"
                className="gmForm__input"
                value={newForm.code}
                onChange={(e) => setNewForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="FAM-XXX"
                required
              />
            </div>
            <div className="gmForm__group">
              <label className="gmForm__label">Libellé</label>
              <input
                type="text"
                className="gmForm__input"
                value={newForm.label}
                onChange={(e) => setNewForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Nom de la famille"
                required
              />
            </div>
          </div>
          <div className="gmForm__actions">
            <button type="button" className="gmBtn gmBtn--secondary" onClick={() => setShowNew(false)}>
              Annuler
            </button>
            <button type="submit" className="gmBtn gmBtn--primary">
              Créer
            </button>
          </div>
        </form>
      )}

      <section className="gmTable">
        <table className="gmTable__table">
          <thead>
            <tr>
              <th className="gmTable__th">Code</th>
              <th className="gmTable__th">Libellé</th>
              <th className="gmTable__th">Nb Produits</th>
              <th className="gmTable__th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="gmTable__td" colSpan="4" style={{ textAlign: 'center' }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="gmTable__td" colSpan="4" style={{ textAlign: 'center' }}>
                  Aucune famille trouvée
                </td>
              </tr>
            ) : (
              filtered.map((family) => (
                <tr key={family.id} className="gmTable__tr">
                  <td className="gmTable__td">
                    {editingId === family.id ? (
                      <input
                        type="text"
                        className="gmForm__input"
                        value={editForm.code}
                        onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))}
                      />
                    ) : (
                      <span className="gmBadge">{family.code}</span>
                    )}
                  </td>
                  <td className="gmTable__td">
                    {editingId === family.id ? (
                      <input
                        type="text"
                        className="gmForm__input"
                        value={editForm.label}
                        onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                      />
                    ) : (
                      family.label
                    )}
                  </td>
                  <td className="gmTable__td">{family._count?.products || 0}</td>
                  <td className="gmTable__td">
                    <div className="gmTable__actions">
                      {editingId === family.id ? (
                        <>
                          <button className="gmBtn gmBtn--icon" onClick={saveEdit} type="button">
                            <Save size={18} />
                          </button>
                          <button className="gmBtn gmBtn--icon" onClick={cancelEdit} type="button">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="gmBtn gmBtn--icon" onClick={() => startEdit(family)} type="button">
                            <Edit size={18} />
                          </button>
                          <button
                            className="gmBtn gmBtn--icon gmBtn--icon--delete"
                            onClick={() => handleDelete(family.id)}
                            type="button"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
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
