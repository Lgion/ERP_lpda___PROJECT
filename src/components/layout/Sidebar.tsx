import { LayoutDashboard, Settings, LogOut, ChevronDown, FileText, ArrowLeftRight, Printer, Calculator, Box, Layers } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/' },
  {
    icon: FileText,
    label: 'Fichier',
    path: '/fichier', // Parent path for matching
    children: [
      { icon: Box, label: 'Produits', path: '/produits' },
      { icon: Layers, label: 'Familles', path: '/familles' },
    ]
  },
  { icon: ArrowLeftRight, label: 'Mouvements', path: '/mouvements' },
  {
    icon: Calculator,
    label: 'Gestion',
    path: '/gestion',
    children: [
      { icon: Box, label: 'Arrivages Stock', path: '/gestion/arrivages' },
      { icon: Layers, label: 'Fournisseurs', path: '/gestion/fournisseurs' },
      { icon: Layers, label: 'Clients', path: '/gestion/clients' },
    ]
  },
  { icon: Printer, label: 'Impressions', path: '/impressions' },
];

export function Sidebar() {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  // Auto-expand menu if child is active
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child => location.pathname.startsWith(child.path));
        if (isChildActive && !openSubmenus.includes(item.label)) {
          setOpenSubmenus(prev => [...prev, item.label]);
        }
      }
    });
  }, [location.pathname]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          Gestomag
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.label} className="nav-group">
            {item.children ? (
              <>
                <button
                  className={`nav-item w-full justify-between ${openSubmenus.includes(item.label) ? 'active-parent' : ''}`}
                  onClick={() => toggleSubmenu(item.label)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openSubmenus.includes(item.label) ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSubmenus.includes(item.label) && (
                  <div className="submenu">
                    {item.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `nav-item submenu-item ${isActive ? 'active' : ''}`
                        }
                      >
                        <child.icon size={18} />
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
          <span>Paramètres</span>
        </button>
        <button className="nav-item">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background-color: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          color: var(--text-secondary);
        }

        .sidebar-header {
          padding: var(--spacing-6);
          border-bottom: 1px solid var(--border);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          cursor: pointer;
          text-decoration: none;
          font-weight: 500;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background-color: var(--surface-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--primary);
          color: white;
        }

        .active-parent {
          color: var(--text-primary);
          background-color: var(--surface-hover);
        }

        .submenu {
          margin-left: 12px;
          padding-left: 12px;
          border-left: 1px solid var(--border);
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .submenu-item {
          font-size: 0.9rem;
          padding: var(--spacing-2) var(--spacing-3);
        }

        .w-full { width: 100%; }
        .justify-between { justify-content: space-between; }
        .flex { display: flex; }
        .transition-transform { transition: transform 0.2s ease; }
        .rotate-180 { transform: rotate(180deg); }

        .sidebar-footer {
          padding: var(--spacing-4);
          border-top: 1px solid var(--border);
        }
      `}</style>
    </aside>
  );
}
