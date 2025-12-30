import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import GmSidebar from '@/app/components/gestomag/GmSidebar';
import '@/assets/scss/style.scss';

export const metadata = {
  title: 'Gestomag - Gestion de Stock',
  description: 'Application de gestion de stock et inventaire',
};

export default function GestomagLayout({ children }) {
  return (
    <>
      <SignedIn>
        <div className="gestomag">
          <div className="gestomag__layout">
            <GmSidebar />
            <main className="gestomag__main">
              {children}
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
