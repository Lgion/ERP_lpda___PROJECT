'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { familyService } from '../../gestomag/services/familyService';

export default function FamilyDropdown() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent closing if we want to keep it open, though click inside should be fine
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

  // Toggle new form on trigger click
  const handleTriggerClick = (e) => {
    // e.preventDefault(); // If it's a link?
    setShowNew(prev => !prev);
  };

  return (
    <div className="gmFamilyDropdown">
      <button 
        className="gmBtn gmBtn--primary gmFamilyDropdown__trigger" 
        onClick={handleTriggerClick}
        type="button"
      >
        <Plus size={20} />
        <span>+ Nouvelle Famille</span>
      </button>

      <div className="gmFamilyDropdown__content">
        <header className="gmFamilyDropdown__header">
          <h3 className="gmFamilyDropdown__title">Familles</h3>
          <span className="gmBadge">{families.length}</span>
        </header>

        {showNew && (
          <form className="gmFamilyDropdown__form" onSubmit={handleNewSubmit}>
            <div className="gmForm__group" style={{ marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="gmForm__input"
                value={newForm.code}
                onChange={(e) => setNewForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Code (ex: FAM-001)"
                required
              />
            </div>
            <div className="gmForm__group" style={{ marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="gmForm__input"
                value={newForm.label}
                onChange={(e) => setNewForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Libellé"
                required
              />
            </div>
            <div className="gmForm__actions" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="gmBtn gmBtn--secondary gmBtn--sm" 
                onClick={() => setShowNew(false)}
              >
                Annuler
              </button>
              <button type="submit" className="gmBtn gmBtn--primary gmBtn--sm">
                Créer
              </button>
            </div>
          </form>
        )}

        <div className="gmFamilyDropdown__list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
              Chargement...
            </div>
          ) : families.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
              Aucune famille trouvée
            </div>
          ) : (
            families.map((family) => (
              <div key={family.id} className="gmFamilyDropdown__item">
                {editingId === family.id ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="gmForm__input"
                        value={editForm.code}
                        onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="Code"
                        style={{ width: '30%' }}
                      />
                      <input
                        type="text"
                        className="gmForm__input"
                        value={editForm.label}
                        onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Libellé"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <div className="gmFamilyDropdown__actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="gmBtn gmBtn--icon" onClick={saveEdit} type="button" title="Sauvegarder">
                        <Save size={16} />
                      </button>
                      <button className="gmBtn gmBtn--icon" onClick={cancelEdit} type="button" title="Annuler">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="gmFamilyDropdown__info">
                      <span className="gmFamilyDropdown__code">{family.code}</span>
                      <span className="gmFamilyDropdown__label">{family.label}</span>
                    </div>
                    <div className="gmFamilyDropdown__actions">
                      <button 
                        className="gmBtn gmBtn--icon" 
                        onClick={() => startEdit(family)} 
                        type="button"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="gmBtn gmBtn--icon gmBtn--icon--delete"
                        onClick={(e) => handleDelete(e, family.id)}
                        type="button"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
