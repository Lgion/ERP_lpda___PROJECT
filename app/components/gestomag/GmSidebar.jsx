'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ChevronDown, 
  FileText, 
  ArrowLeftRight, 
  Printer, 
  Calculator, 
  Box, 
  Layers 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Accueil', path: '/gestomag' },
  {
    icon: FileText,
    label: 'Fichier',
    path: '/gestomag/fichier',
    children: [
      { icon: Box, label: 'Produits', path: '/gestomag/produits' },
      { icon: Layers, label: 'Familles', path: '/gestomag/familles' },
    ]
  },
  { icon: ArrowLeftRight, label: 'Mouvements', path: '/gestomag/mouvements' },
  {
    icon: Calculator,
    label: 'Gestion',
    path: '/gestomag/gestion',
    children: [
      { icon: Box, label: 'Arrivages Stock', path: '/gestomag/gestion/arrivages' },
      { icon: Layers, label: 'Fournisseurs', path: '/gestomag/gestion/fournisseurs' },
      { icon: Layers, label: 'Clients', path: '/gestomag/gestion/clients' },
    ]
  },
  { icon: Printer, label: 'Impressions', path: '/gestomag/impressions' },
];

export default function GmSidebar() {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState([]);

  useEffect(() => {
    menuItems.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child => pathname.startsWith(child.path));
        if (isChildActive && !openSubmenus.includes(item.label)) {
          setOpenSubmenus(prev => [...prev, item.label]);
        }
      }
    });
  }, [pathname]);

  const toggleSubmenu = (label) => {
    setOpenSubmenus(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isActive = (path) => {
    if (path === '/gestomag') {
      return pathname === '/gestomag';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="gmSidebar">
      <header className="gmSidebar__header">
        <span className="gmSidebar__logo">Gestomag</span>
      </header>

      <nav className="gmSidebar__nav">
        {menuItems.map((item) => (
          <div key={item.label} className="gmSidebar__group">
            {item.children ? (
              <>
                <button
                  className={`gmSidebar__item gmSidebar__item--parent ${openSubmenus.includes(item.label) ? 'is-open' : ''}`}
                  onClick={() => toggleSubmenu(item.label)}
                  type="button"
                >
                  <span className="gmSidebar__itemContent">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`gmSidebar__chevron ${openSubmenus.includes(item.label) ? 'is-rotated' : ''}`}
                  />
                </button>
                {openSubmenus.includes(item.label) && (
                  <div className="gmSidebar__submenu">
                    {item.children.map(child => (
                      <Link
                        key={child.path}
                        href={child.path}
                        className={`gmSidebar__item gmSidebar__subitem ${isActive(child.path) ? 'gmSidebar__item--active' : ''}`}
                      >
                        <child.icon size={18} />
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.path}
                className={`gmSidebar__item ${isActive(item.path) ? 'gmSidebar__item--active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <footer className="gmSidebar__footer">
        <button className="gmSidebar__item" type="button">
          <Settings size={20} />
          <span>Paramètres</span>
        </button>
        <button className="gmSidebar__item" type="button">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </footer>
    </aside>
  );
}
