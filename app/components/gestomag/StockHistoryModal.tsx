'use client';

import { X, ArrowRight } from 'lucide-react';

export default function StockHistoryModal({ isOpen, onClose, product, history }) {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReasonLabel = (type, reason) => {
    if (reason) return reason;
    switch (type) {
      case 'manual_adjustment': return 'Ajustement manuel';
      case 'sale': return 'Vente';
      case 'arrival': return 'Arrivage';
      case 'initial': return 'Stock initial';
      default: return type;
    }
  };

  return (
    <div className="gmModal" onClick={onClose}>
      <div className="gmModal__content" onClick={e => e.stopPropagation()}>
        <header className="gmModal__header">
          <h3 className="gmModal__title">
            Historique du stock - {product?.name}
          </h3>
          <button className="gmModal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </header>
        
        <div className="gmModal__body">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              Aucun historique disponible pour ce produit.
            </div>
          ) : (
            <div className="gmList">
              {history.map((item) => (
                <div key={item._id} className="gmList__item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>
                      {getReasonLabel(item.type, item.reason)}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#64748b' }}>{item.previousStock}</span>
                    <ArrowRight size={14} color="#94a3b8" />
                    <span style={{ fontWeight: 600, color: item.delta > 0 ? '#10b981' : item.delta < 0 ? '#ef4444' : '#1e293b' }}>
                      {item.newStock}
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 500, color: item.delta > 0 ? '#10b981' : item.delta < 0 ? '#ef4444' : '#64748b' }}>
                      {item.delta > 0 ? '+' : ''}{item.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
