'use client';

import { useState, useEffect } from 'react';
import { Package, Users, Truck, AlertTriangle } from 'lucide-react';

export default function GestomagDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    families: 0,
    suppliers: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsRes, familiesRes, suppliersRes] = await Promise.all([
          fetch('/api/gestomag/products'),
          fetch('/api/gestomag/families'),
          fetch('/api/gestomag/suppliers')
        ]);

        const products = await productsRes.json();
        const families = await familiesRes.json();
        const suppliers = await suppliersRes.json();

        const lowStockCount = Array.isArray(products) 
          ? products.filter(p => p.stock <= p.minStock).length 
          : 0;

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          families: Array.isArray(families) ? families.length : 0,
          suppliers: Array.isArray(suppliers) ? suppliers.length : 0,
          lowStock: lowStockCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Produits', value: stats.products, icon: Package, color: '#6366f1' },
    { label: 'Familles', value: stats.families, icon: Users, color: '#22c55e' },
    { label: 'Fournisseurs', value: stats.suppliers, icon: Truck, color: '#3b82f6' },
    { label: 'Stock Faible', value: stats.lowStock, icon: AlertTriangle, color: '#ef4444' }
  ];

  return (
    <article className="gestomag__page">
      <header className="gestomag__header">
        <h1 className="gestomag__title">Tableau de Bord</h1>
      </header>

      <section className="gmStats">
        {statCards.map((card) => (
          <article key={card.label} className="gmStats__card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="gmStats__label">{card.label}</span>
              <card.icon size={24} style={{ color: card.color }} />
            </div>
            <span className="gmStats__value">
              {loading ? '...' : card.value}
            </span>
          </article>
        ))}
      </section>

      <section className="gmCard">
        <h3 className="gmCard__title">Activité Récente</h3>
        <p style={{ color: 'var(--gm-text-muted, #64748b)' }}>
          Bienvenue dans Gestomag. Utilisez le menu de gauche pour naviguer.
        </p>
      </section>
    </article>
  );
}
