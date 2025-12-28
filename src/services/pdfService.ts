import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define interface for Product matching our mock data
interface Product {
    ref: string;
    name: string;
    family: string;
    price: number;
    stock: number;
}

export const generateStockPdf = (products: Product[], title: string) => {
    const doc = new jsPDF();

    // -- Header --
    doc.setFontSize(20);
    doc.text('GESTOMAG', 14, 20);

    doc.setFontSize(10);
    doc.text('Gestion Commerciale & Stock', 14, 26);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 32);

    // -- Report Title --
    doc.setFontSize(16);
    doc.setTextColor(99, 102, 241); // Primary color (Indigio-like)
    doc.text(title.toUpperCase(), 14, 45);
    doc.setTextColor(0, 0, 0); // Reset color

    // -- Table --
    const tableColumn = ["Référence", "Désignation", "Famille", "Prix TTC", "Stock"];
    const tableRows = products.map(product => [
        product.ref,
        product.name,
        product.family,
        product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }),
        product.stock
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] }, // Matches primary color
        alternateRowStyles: { fillColor: [245, 247, 255] },
        styles: { fontSize: 9, cellPadding: 3 },
    });

    // -- Footer --
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
    }

    doc.save(`gestomag_rapport_${new Date().getTime()}.pdf`);
};
