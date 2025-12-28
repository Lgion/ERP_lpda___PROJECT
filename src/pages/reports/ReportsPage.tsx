import { FileText, Download, Printer } from 'lucide-react';
import { generateStockPdf } from '../../services/pdfService';
import { MOCK_PRODUCTS } from '../products/ProductList';

export function ReportsPage() {

    const handlePrintAvailableStock = () => {
        const availableProducts = MOCK_PRODUCTS.filter(p => p.stock > 0).map(p => ({
            ...p,
            family: p.family?.label || 'Sans Famille'
        }));
        generateStockPdf(availableProducts, 'Liste des Stocks Disponibles');
    };

    const handlePrintOutOfStock = () => {
        const outOfStockProducts = MOCK_PRODUCTS.filter(p => p.stock === 0).map(p => ({
            ...p,
            family: p.family?.label || 'Sans Famille'
        }));
        generateStockPdf(outOfStockProducts, 'Liste des Ruptures de Stock');
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h2 className="title">Impressions & Rapports</h2>
                    <p className="subtitle">Générez vos états de stock et documents comptables</p>
                </div>
            </header>

            <div className="grid-3">
                {/* Available Stock Report */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 style={{ border: 'none', margin: 0, padding: 0 }}>Stocks Disponibles</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Liste valorisée des produits en stock
                            </p>
                        </div>
                    </div>
                    <button className="btn-secondary" style={{ justifyContent: 'center', marginTop: 'auto' }} onClick={handlePrintAvailableStock}>
                        <Download size={18} />
                        Télécharger PDF
                    </button>
                </div>

                {/* Out of Stock Report */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 style={{ border: 'none', margin: 0, padding: 0 }}>Ruptures de Stock</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Liste des produits à commander
                            </p>
                        </div>
                    </div>
                    <button className="btn-secondary" style={{ justifyContent: 'center', marginTop: 'auto' }} onClick={handlePrintOutOfStock}>
                        <Download size={18} />
                        Télécharger PDF
                    </button>
                </div>

                {/* Sales Journal (Placeholder) */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--surface-hover)', color: 'var(--text-muted)' }}>
                            <Printer size={24} />
                        </div>
                        <div>
                            <h3 style={{ border: 'none', margin: 0, padding: 0 }}>Journal des Ventes</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                                (Bientôt disponible)
                            </p>
                        </div>
                    </div>
                    <button className="btn-secondary" style={{ justifyContent: 'center', marginTop: 'auto' }} disabled>
                        <Download size={18} />
                        Télécharger PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
