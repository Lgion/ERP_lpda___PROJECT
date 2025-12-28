import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { arrivalService } from '../../services/arrivalService';
import { productService, type Product } from '../../services/productService';

interface Supplier {
    id: number;
    name: string;
}

interface ArrivalLine {
    id: number;
    productId: number;
    productName: string;
    productRef: string;
    quantity: number;
    unitPrice: number;
}

export function ArrivalForm() {
    const navigate = useNavigate();

    // Data from API
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Header State
    const [supplierId, setSupplierId] = useState('');
    const [reference, setReference] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Lines State
    const [lines, setLines] = useState<ArrivalLine[]>([]);

    useEffect(() => {
        // Load suppliers and products from API
        fetch('/api/suppliers').then(r => r.json()).then(setSuppliers);
        productService.getAll().then(setProducts);
    }, []);

    // Line Input State
    const [selectedProduct, setSelectedProduct] = useState('');
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);

    const handleAddLine = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id === Number(selectedProduct));
        if (!product) return;

        const newLine: ArrivalLine = {
            id: Date.now(),
            productId: product.id!,
            productName: product.name,
            productRef: product.ref,
            quantity: qty,
            unitPrice: price
        };

        setLines([...lines, newLine]);
        // Reset line inputs
        setSelectedProduct('');
        setQty(1);
        setPrice(0);
    };

    const removeLine = (id: number) => {
        setLines(lines.filter(l => l.id !== id));
    };

    const calculateTotal = () => {
        return lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await arrivalService.create({
                date,
                reference,
                supplierId: Number(supplierId),
                lines: lines.map(line => ({
                    productId: line.productId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice
                }))
            });
            navigate('/gestion/arrivages');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="btn-ghost" onClick={() => navigate('/gestion/arrivages')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={20} />
                    Retour
                </button>
                <h2 className="title">Nouvel Arrivage de Stock</h2>
            </header>

            <form onSubmit={handleSubmit} className="form-container">
                {/* Header Info */}
                <div className="card">
                    <h3>Informations Générales</h3>
                    <div className="grid-3">
                        <div className="form-group">
                            <label>Fournisseur</label>
                            <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
                                <option value="">Choisir un fournisseur...</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Référence Bordereau (BL)</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={e => setReference(e.target.value)}
                                placeholder="Ex: BL-2024-XXX"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date Arrivage</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Line Entry */}
                <div className="card">
                    <h3>Saisie des Produits</h3>
                    <div className="entry-row" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                        <div className="form-group">
                            <label>Produit</label>
                            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                                <option value="">Sélectionner un produit...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.ref} - {p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quantité</label>
                            <input
                                type="number"
                                min="1"
                                value={qty}
                                onChange={e => setQty(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Prix Achat U. (FCFA)</label>
                            <input
                                type="number"
                                min="0"
                                value={price}
                                onChange={e => setPrice(parseInt(e.target.value))}
                            />
                        </div>
                        <button type="button" className="btn-secondary" onClick={handleAddLine} disabled={!selectedProduct}>
                            <Plus size={20} />
                            Ajouter
                        </button>
                    </div>

                    {/* Lines Table */}
                    <div className="lines-table-container" style={{ marginTop: '24px' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th className="text-center">Quantité</th>
                                    <th className="text-right">P.U. Achat</th>
                                    <th className="text-right">Total Ligne</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted" style={{ padding: '24px' }}>
                                            Aucun produit ajouté au bon de réception
                                        </td>
                                    </tr>
                                ) : (
                                    lines.map(line => (
                                        <tr key={line.id}>
                                            <td>
                                                <span className="text-muted">{line.productRef}</span> - {line.productName}
                                            </td>
                                            <td className="text-center font-bold">{line.quantity}</td>
                                            <td className="text-right">{line.unitPrice.toLocaleString()} FCFA</td>
                                            <td className="text-right font-bold">{(line.quantity * line.unitPrice).toLocaleString()} FCFA</td>
                                            <td className="text-right">
                                                <button type="button" className="icon-btn delete" onClick={() => removeLine(line.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="text-right font-bold" style={{ fontSize: '1.1rem' }}>Total Arrivage</td>
                                    <td className="text-right font-bold" style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                                        {calculateTotal().toLocaleString()} FCFA
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-ghost" onClick={() => navigate('/gestion/arrivages')}>
                        Annuler
                    </button>
                    <button type="submit" className="btn-primary" disabled={lines.length === 0 || loading}>
                        <Save size={20} />
                        {loading ? 'Enregistrement...' : "Valider l'entrée de stock"}
                    </button>
                    {error && <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>{error}</p>}
                </div>
            </form>
        </div>
    );
}
