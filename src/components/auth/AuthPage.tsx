import { SignIn, SignUp } from '@clerk/clerk-react';
import { useState } from 'react';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>GestoMag</h1>
          <p>Système de gestion de magasin</p>
        </div>
        
        <div className="auth-toggle">
          <button 
            className={!isSignUp ? 'active' : ''}
            onClick={() => setIsSignUp(false)}
          >
            Connexion
          </button>
          <button 
            className={isSignUp ? 'active' : ''}
            onClick={() => setIsSignUp(true)}
          >
            Inscription
          </button>
        </div>

        <div className="auth-form">
          {isSignUp ? (
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                  card: 'shadow-none border-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
            />
          ) : (
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                  card: 'shadow-none border-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }

        .auth-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 100%;
          max-width: 400px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .auth-toggle {
          display: flex;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 2rem;
        }

        .auth-toggle button {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
        }

        .auth-toggle button.active {
          background: white;
          color: #2563eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .auth-toggle button:not(.active) {
          color: #6b7280;
        }

        .auth-form {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
