export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Chiffre d'affaires</h3>
          <p className="value">8 160 500 FCFA</p>
          <span className="trend positive">+12% vs N-1</span>
        </div>
        <div className="stat-card">
          <h3>Commandes</h3>
          <p className="value">45</p>
          <span className="trend neutral">Stable</span>
        </div>
        <div className="stat-card">
          <h3>Clients</h3>
          <p className="value">1 280</p>
          <span className="trend positive">+5 this week</span>
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-6);
        }

        .stat-card {
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
        }

        .stat-card h3 {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-2);
          font-weight: 500;
        }

        .stat-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--spacing-2);
        }

        .trend {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .trend.positive { color: var(--success); }
        .trend.neutral { color: var(--text-muted); }
      `}</style>
    </div>
  );
}
