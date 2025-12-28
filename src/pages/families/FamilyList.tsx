import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { familyService, type Family } from '../../services/familyService';

export function FamilyList() {
    const [families, setFamilies] = useState<Family[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        familyService.getAll().then(setFamilies);
    }, []);

    // Form State
    const [formData, setFormData] = useState({ code: '', label: '', image: '' });

    const handleOpenModal = (family?: Family) => {
        if (family && family.id) {
            setEditingId(family.id);
            setFormData({ code: family.code, label: family.label, image: family.image || '' });
            setImagePreview(family.image || null);
        } else {
            setEditingId(null);
            setFormData({ code: '', label: '', image: '' });
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) throw new Error('Upload failed');

            const { url } = await response.json();
            setFormData(prev => ({ ...prev, image: url }));
        } catch (err) {
            setError('Erreur lors de l\'upload de l\'image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (editingId) {
                // Edit mode
                const updated = await familyService.update(editingId, formData);
                setFamilies(families.map(f => f.id === editingId ? { ...f, ...updated } : f));
            } else {
                // Create mode
                const newFamily = await familyService.create(formData);
                setFamilies([...families, { ...newFamily, productCount: 0 }]);
            }
            handleCloseModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette famille ?')) {
            try {
                await familyService.delete(id);
                setFamilies(families.filter(f => f.id !== id));
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h2 className="title">Familles de Produits</h2>
                    <p className="subtitle">Gérez les catégories de votre catalogue</p>
                </div>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Nouvelle Famille
                </button>
            </header>

            <div className="toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input type="text" placeholder="Rechercher une famille..." />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '150px' }}>Code</th>
                            <th>Désignation</th>
                            <th className="text-center">Nombre de Produits</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {families.map((family) => (
                            <tr key={family.id}>
                                <td className="font-medium text-muted">{family.code}</td>
                                <td className="font-bold">{family.label}</td>
                                <td className="text-center">
                                    <span className="badge-count">{family.productCount}</span>
                                </td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="icon-btn" onClick={() => handleOpenModal(family)}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete" onClick={() => family.id && handleDelete(family.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingId ? 'Modifier la famille' : 'Nouvelle famille'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Code Famille</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="Ex: FAM-001"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Désignation</label>
                                    <input
                                        type="text"
                                        value={formData.label}
                                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                                        placeholder="Ex: Informatique"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Image de la famille</label>
                                    <div className="image-upload-row">
                                        <div className="image-preview-small">
                                            {imagePreview || formData.image ? (
                                                <div className="preview-wrapper">
                                                    <img src={imagePreview || formData.image} alt="Aperçu" />
                                                    <button type="button" className="remove-image-btn-small" onClick={removeImage}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="no-image-small">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="upload-actions-row">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                type="button"
                                                className="btn-secondary btn-small"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                            >
                                                <Upload size={16} />
                                                {uploading ? 'Upload...' : 'Choisir'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{error}</p>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-ghost" onClick={handleCloseModal}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    <Check size={18} />
                                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        .badge-count {
          background-color: var(--surface-hover);
          color: var(--text-secondary);
          padding: 2px 10px;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal {
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          padding: var(--spacing-4) var(--spacing-6);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-btn {
          color: var(--text-secondary);
          padding: var(--spacing-1);
          border-radius: var(--radius-sm);
        }
        
        .close-btn:hover {
          background-color: var(--surface-hover);
          color: var(--text-primary);
        }

        .modal-body {
          padding: var(--spacing-6);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-group input {
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--spacing-3);
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus {
          border-color: var(--primary);
        }

        .modal-footer {
          padding: var(--spacing-4) var(--spacing-6);
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-3);
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .btn-ghost {
          padding: var(--spacing-2) var(--spacing-4);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .btn-ghost:hover {
          background-color: var(--surface-hover);
          color: var(--text-primary);
        }

        .image-upload-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .image-preview-small {
          width: 80px;
          height: 80px;
          border: 2px dashed var(--border);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .image-preview-small .preview-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .image-preview-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn-small {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .no-image-small {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .upload-actions-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn-small {
          padding: 0.4rem 0.75rem;
          font-size: 0.85rem;
        }
      `}</style>
        </div>
    );
}
