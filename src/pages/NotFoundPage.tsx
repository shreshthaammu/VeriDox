import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white border border-[#E4E9F2] rounded-2xl p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#356AE6] mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#19243A]">404 — Page Not Found</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The requested URL path does not exist on the VeriDox Trust Console platform.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={() => navigate('/app/overview')}
            className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Public Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white border border-[#E4E9F2] rounded-2xl p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#19243A]">Restricted Administrative Area</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Your current user role does not possess platform governance clearance for this administrative console.
        </p>
        <p className="text-[11px] text-[#356AE6] font-semibold mt-2">
          Tip: You can use the top right Persona Switcher to switch to "Sarah Chen (Compliance Admin)".
        </p>

        <div className="mt-6 flex gap-2.5 justify-center">
          <button
            onClick={() => navigate('/app/overview')}
            className="px-4 py-2 bg-[#356AE6] text-white text-xs font-bold rounded-lg"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
