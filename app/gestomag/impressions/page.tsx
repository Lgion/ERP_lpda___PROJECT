'use client';

import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { productService } from '../services/productService';

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data);
    setLoading(false);
  };

  const generateStockReport = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Rapport de Stock', 14, 22);
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

      const tableData = products.map(p => [
        p.ref,
        p.name,
        p.family?.label || '-',
        p.stock.toString(),
        p.minStock.toString(),
        p.price.toFixed(2) + ' €',
        p.status === 'available' ? 'Disponible' : 'Rupture'
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Réf', 'Nom', 'Famille', 'Stock', 'Min', 'Prix', 'Statut']],
        body: tableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [99, 102, 241] }
      });

      doc.save('rapport-stock.pdf');
    } catch (error) {
      alert('Erreur lors de la génération du PDF. Assurez-vous que jspdf est installé.');
      console.error(error);
    }
  };

  const generateLowStockReport = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Produits en Stock Faible', 14, 22);
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

      const lowStockProducts = products.filter(p => p.stock <= p.minStock);
      const tableData = lowStockProducts.map(p => [
        p.ref,
        p.name,
        p.stock.toString(),
        p.minStock.toString(),
        (p.minStock - p.stock).toString()
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Réf', 'Nom', 'Stock Actuel', 'Stock Min', 'Manquant']],
        body: tableData,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [239, 68, 68] }
      });

      doc.save('rapport-stock-faible.pdf');
    } catch (error) {
      alert('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };

  const reports = [
    {
      title: 'Rapport de Stock Complet',
      description: 'Liste de tous les produits avec leurs stocks et prix',
      icon: FileText,
      action: generateStockReport
    },
    {
      title: 'Produits en Stock Faible',
      description: 'Liste des produits dont le stock est inférieur au minimum',
      icon: FileText,
      action: generateLowStockReport
    }
  ];

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <h1 className="gestomag__title">Impressions & Rapports</h1>
      </header>

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {reports.map((report, index) => (
            <article key={index} className="gmCard">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem' }}>
                  <report.icon size={24} style={{ color: '#6366f1' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1rem' }}>{report.title}</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>{report.description}</p>
                </div>
              </div>
              <button
                className="gmBtn gmBtn--primary"
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                onClick={report.action}
              >
                <Download size={18} />
                <span>Télécharger PDF</span>
              </button>
            </article>
          ))}
        </section>
      )}

      <section className="gmCard" style={{ marginTop: '1.5rem' }}>
        <h3 className="gmCard__title">Statistiques rapides</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Total produits</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{products.length}</p>
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>En rupture</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#ef4444' }}>
              {products.filter(p => p.status === 'out_of_stock').length}
            </p>
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Stock faible</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#eab308' }}>
              {products.filter(p => p.stock <= p.minStock && p.stock > 0).length}
            </p>
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Valeur stock</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              {products.reduce((sum, p) => sum + (p.stock * p.price), 0).toFixed(2)} €
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
