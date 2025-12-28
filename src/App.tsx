import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { MainLayout } from './components/layout/MainLayout';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/products/ProductList';
import { ProductForm } from './pages/products/ProductForm';
import { FamilyList } from './pages/families/FamilyList';
import { SupplierList } from './pages/gestion/SupplierList';
import { ClientList } from './pages/gestion/ClientList';
import { ArrivalsList } from './pages/gestion/ArrivalsList';
import { ArrivalForm } from './pages/gestion/ArrivalForm';
import { SupplierForm } from './pages/gestion/SupplierForm';
import { ClientForm } from './pages/gestion/ClientForm';
import { ReportsPage } from './pages/reports/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <MainLayout />
              </SignedIn>
              <SignedOut>
                <AuthPage />
              </SignedOut>
            </>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="produits" element={<ProductList />} />
          <Route path="produits/nouveau" element={<ProductForm />} />
          <Route path="produits/edit/:id" element={<ProductForm />} />
          <Route path="familles" element={<FamilyList />} />
          <Route path="mouvements" element={<div>Mouvements Page (Work in Progress)</div>} />
          <Route path="mouvements" element={<div>Mouvements Page (Work in Progress)</div>} />

          {/* Module Gestion */}
          <Route path="gestion" element={<ArrivalsList />} /> {/* Default to Arrivals for now */}
          <Route path="gestion/fournisseurs" element={<SupplierList />} />
          <Route path="gestion/fournisseurs/nouveau" element={<SupplierForm />} />
          <Route path="gestion/fournisseurs/edit/:id" element={<SupplierForm />} />

          <Route path="gestion/clients" element={<ClientList />} />
          <Route path="gestion/clients/nouveau" element={<ClientForm />} />
          <Route path="gestion/clients/edit/:id" element={<ClientForm />} />

          <Route path="gestion/arrivages" element={<ArrivalsList />} />
          <Route path="gestion/arrivages/nouveau" element={<ArrivalForm />} />

          <Route path="impressions" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
