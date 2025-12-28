import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { familyService, type Family } from '../../services/familyService';

export function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [families, setFamilies] = useState<Family[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        ref: '',
        name: '',
        familyId: '',
        price: '',
        stock: '0',
        minStock: '0',
        vat: '20',
        image: '',
        cloudinaryId: ''
    });

    useEffect(() => {
        // Load families from API
        familyService.getAll().then(setFamilies);

        // Load product data if in edit mode
        if (isEditMode && id) {
            productService.getById(Number(id)).then(product => {
                if (product) {
                    setFormData({
                        ref: product.ref,
                        name: product.name,
                        familyId: String(product.familyId || ''),
                        price: String(product.price),
                        stock: String(product.stock),
                        minStock: String(product.minStock),
                        vat: String(product.vat),
                        image: product.image || '',
                        cloudinaryId: product.cloudinaryId || ''
                    });
                    if (product.image) {
                        setImagePreview(product.image);
                    }
                }
            });
        }
    }, [id, isEditMode]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) throw new Error('Upload failed');

            const { url, publicId } = await response.json();
            setFormData(prev => ({ ...prev, image: url, cloudinaryId: publicId }));
        } catch (err) {
            setError('Erreur lors de l\'upload de l\'image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: '', cloudinaryId: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const productData = {
            ref: formData.ref,
            name: formData.name,
            familyId: Number(formData.familyId),
            price: Number(formData.price),
            stock: Number(formData.stock),
            minStock: Number(formData.minStock),
            vat: Number(formData.vat),
            status: Number(formData.stock) > 0 ? 'available' as const : 'out_of_stock' as const,
            image: formData.image || undefined,
            cloudinaryId: formData.cloudinaryId || undefined,
        };

        try {
            if (isEditMode && id) {
                await productService.update(Number(id), productData);
            } else {
                await productService.create(productData);
            }
            navigate('/produits');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="btn-ghost" onClick={() => navigate('/produits')}>
                    <ArrowLeft size={20} />
                    Retour
                </button>
                <h2 className="title">{isEditMode ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
            </header>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-section">
                    <h3>Informations Générales</h3>
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Référence *</label>
                            <input
                                type="text"
                                name="ref"
                                value={formData.ref}
                                onChange={handleChange}
                                required
                                placeholder="EX: REF-123456"
                            />
                        </div>
                        <div className="form-group">
                            <label>Famille *</label>
                            <select
                                name="familyId"
                                value={formData.familyId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner une famille</option>
                                {families.map(f => (
                                    <option key={f.id} value={f.id}>{f.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Désignation *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Nom du produit"
                        />
                    </div>
                    {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{error}</p>}
                </div>

                <div className="form-section">
                    <h3>Image du produit</h3>
                    <div className="image-upload-container">
                        <div className="image-preview">
                            {imagePreview || formData.image ? (
                                <div className="preview-wrapper">
                                    <img src={imagePreview || formData.image} alt="Aperçu" />
                                    <button type="button" className="remove-image-btn" onClick={removeImage}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="no-image">
                                    <ImageIcon size={48} />
                                    <span>Aucune image</span>
                                </div>
                            )}
                        </div>
                        <div className="upload-actions">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <Upload size={18} />
                                {uploading ? 'Upload en cours...' : 'Choisir une image'}
                            </button>
                            <p className="upload-hint">JPG, PNG ou GIF. Max 5 Mo.</p>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Prix & Stock</h3>
                    <div className="grid-3">
                        <div className="form-group">
                            <label>Prix Vente TTC (FCFA) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>TVA (%)</label>
                            <select name="vat" value={formData.vat} onChange={handleChange}>
                                <option value="18">18%</option>
                                <option value="20">20%</option>
                                <option value="10">10%</option>
                                <option value="5.5">5.5%</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Seuil Alerte</label>
                            <input
                                type="number"
                                name="minStock"
                                value={formData.minStock}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="btn-ghost" onClick={() => navigate('/produits')}>
                        Annuler
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Enregistrer le produit')}
                    </button>
                </div>
            </form>

            <style>{`
                .image-upload-container {
                    display: flex;
                    gap: 1.5rem;
                    align-items: flex-start;
                }

                .image-preview {
                    width: 150px;
                    height: 150px;
                    border: 2px dashed var(--border);
                    border-radius: 12px;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .preview-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .preview-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .remove-image-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .remove-image-btn:hover {
                    background: var(--error);
                }

                .no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    gap: 0.5rem;
                }

                .no-image span {
                    font-size: 0.8rem;
                }

                .upload-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .upload-hint {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
