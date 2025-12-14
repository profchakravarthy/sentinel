import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Search, Upload, ShieldCheck, Hash } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  isLoading: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isLoading }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    location: '',
    occupation: '',
    keywords: '',
    photoUrl: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, photoUrl: url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sentinel</h1>
          <p className="text-slate-400">Secure Personal Web Monitor</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center mb-6">
             <label className="relative cursor-pointer group">
                <div className={`w-24 h-24 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden transition-colors group-hover:border-indigo-500 ${formData.photoUrl ? 'border-solid border-indigo-500' : ''}`}>
                    {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <Upload className="text-slate-500 group-hover:text-indigo-400" size={24} />
                    )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                {!formData.photoUrl && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 whitespace-nowrap">Upload Photo</span>}
             </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
             <input 
               type="password" 
               name="email"
               required
               className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
               placeholder="e.g. jane@example.com"
               value={formData.email}
               onChange={handleInputChange}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                <input 
                type="text" 
                name="location"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g. New York"
                value={formData.location}
                onChange={handleInputChange}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Occupation</label>
                <input 
                type="text" 
                name="occupation"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g. Engineer"
                value={formData.occupation}
                onChange={handleInputChange}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                <Hash size={14} className="text-indigo-400"/>
                Search Keywords (Optional)
            </label>
            <input 
              type="text" 
              name="keywords"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
              placeholder="e.g. 'Project Alpha', 'username123', 'Old Company Inc'"
              value={formData.keywords}
              onChange={handleInputChange}
            />
            <p className="text-xs text-slate-500 mt-1">
                Specific terms, handles, or projects to refine the web scan.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <>
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Scanning Digital Footprint...</span>
                </>
            ) : (
                <>
                 <Search size={18} />
                 <span>Start Monitoring</span>
                </>
            )}
          </button>
          
          <p className="text-xs text-center text-slate-500 mt-4">
            Your data is processed securely via Google Gemini.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;