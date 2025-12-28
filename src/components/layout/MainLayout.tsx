import { Outlet } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Sidebar } from './Sidebar';
import { useAuthUser } from '../../hooks/useAuthUser';

export function MainLayout() {
    const { displayName } = useAuthUser();

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-bar">
                    <h1 className="page-title">Tableau de bord</h1>
                    <div className="user-profile">
                        <span>{displayName}</span>
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8"
                                }
                            }}
                        />
                    </div>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </main>

            <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--background);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .top-bar {
          height: 64px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-6);
          background-color: var(--background); /* Solid background for sticky header */
        }

        .page-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          color: var(--text-primary);
        }


        .content-area {
          flex: 1;
          padding: var(--spacing-6);
          overflow-y: auto;
        }
      `}</style>
        </div>
    );
}
