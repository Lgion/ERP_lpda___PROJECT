'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import { arrivalService } from '../../../services/arrivalService';
import { supplierService } from '../../../services/supplierService';
import { productService } from '../../../services/productService';
import { uploadService } from '../../../services/uploadService';

export default function ArrivalForm() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    supplierId: '',
    attachment: '',
    attachmentCloudinaryId: ''
  });
  const [lines, setLines] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Cleanup camera on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const loadData = async () => {
    try {
      const [suppliersData, productsData] = await Promise.all([
        supplierService.getAll(),
        productService.getAll()
      ]);
      console.log('Suppliers loaded:', suppliersData);
      console.log('Products loaded:', productsData);
      setSuppliers(suppliersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(mediaStream);
      setShowCamera(true);

      // Attach stream to video element
      setTimeout(() => {
        const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Erreur caméra:', error);
      alert('Impossible d\'accéder à la caméra. Veuillez vérifier les autorisations.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
    if (!videoElement) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoElement, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      stopCamera();

      setUploading(true);
      try {
        const result = await uploadService.upload(file);
        setForm(prev => ({
          ...prev,
          attachment: result.url,
          attachmentCloudinaryId: result.publicId
        }));
      } catch (error) {
        alert('Erreur lors de l\'upload de la photo');
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadService.upload(file);
      setForm(prev => ({
        ...prev,
        attachment: result.url,
        attachmentCloudinaryId: result.publicId
      }));
    } catch (error) {
      alert('Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = () => {
    setForm(prev => ({
      ...prev,
      attachment: '',
      attachmentCloudinaryId: ''
    }));
  };

  const addLine = () => {
    setLines([...lines, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateLine = (index, field, value) => {
    const newLines = [...lines];
    newLines[index][field] = value;

    if (field === 'productId' && value) {
      const product = products.find(p => p.id === value);
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
    if (!form.reference) {
      alert('Veuillez renseigner une référence');
      return;
    }
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
              <label className="gmForm__label">Référence *</label>
              <input
                type="text"
                name="reference"
                className="gmForm__input"
                value={form.reference}
                onChange={handleFormChange}
                placeholder="BL-001"
                required
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
          <h3 className="gmForm__sectionTitle">Pièce Jointe (Photo ou PDF)</h3>

          {uploading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="gmUpload__text">Upload en cours...</p>
            </div>
          ) : form.attachment ? (
            <div style={{ position: 'relative', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
              {form.attachment.endsWith('.pdf') ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>📄 PDF attaché</p>
                  <a href={form.attachment} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', fontSize: '0.875rem' }}>
                    Voir le fichier
                  </a>
                </div>
              ) : (
                <img src={form.attachment} alt="Pièce jointe" style={{ maxWidth: '100%', maxHeight: '400px', margin: '0 auto', display: 'block', borderRadius: '8px' }} />
              )}
              <button
                type="button"
                onClick={removeAttachment}
                className="gmBtn gmBtn--secondary"
                style={{ marginTop: '1rem', width: '100%' }}
              >
                <X size={18} />
                <span>Supprimer le fichier</span>
              </button>
            </div>
          ) : showCamera ? (
            <div style={{ border: '2px solid #3b82f6', borderRadius: '12px', padding: '1rem', background: '#000' }}>
              <video
                id="cameraPreview"
                autoPlay
                playsInline
                style={{ width: '100%', maxHeight: '500px', borderRadius: '8px', display: 'block' }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="gmBtn gmBtn--primary"
                  style={{ flex: 1 }}
                >
                  📸 Capturer
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="gmBtn gmBtn--secondary"
                  style={{ flex: 1 }}
                >
                  <X size={18} />
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="fileInput"
              />

              <button
                type="button"
                onClick={startCamera}
                className="gmBtn gmBtn--primary"
                style={{ flex: 1, minWidth: '200px', justifyContent: 'center' }}
              >
                <Upload size={20} />
                <span>📷 Prendre une photo</span>
              </button>

              <label htmlFor="fileInput" className="gmBtn gmBtn--secondary" style={{ flex: 1, minWidth: '200px', cursor: 'pointer', justifyContent: 'center' }}>
                <Upload size={20} />
                <span>📁 Choisir un fichier</span>
              </label>
            </div>
          )}
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
                    <th className="gmTable__th" style={{ width: '60px' }}>Image</th>
                    <th className="gmTable__th">Produit</th>
                    <th className="gmTable__th">Quantité</th>
                    <th className="gmTable__th">Prix Unitaire</th>
                    <th className="gmTable__th">Total</th>
                    <th className="gmTable__th"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => {
                    const selectedProduct = products.find(p => p.id === line.productId);
                    return (
                      <tr key={index} className="gmTable__tr">
                        <td className="gmTable__td">
                          {selectedProduct?.image ? (
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="gmTable__thumb" />
                          ) : (
                            <div className="gmTable__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8', fontSize: '0.75rem' }}>N/A</div>
                          )}
                        </td>
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
                          {(line.quantity * line.unitPrice).toFixed(2)} FCFA
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
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="gmTable__td" colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total :
                    </td>
                    <td className="gmTable__td" style={{ fontWeight: 'bold' }}>
                      {calculateTotal().toFixed(2)} FCFA
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
