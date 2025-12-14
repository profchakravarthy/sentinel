import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Eye, EyeOff, Shield, MapPin, Briefcase, Mail } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const toggleReveal = () => setIsRevealed(!isRevealed);

  const EncryptedText = ({ text }: { text: string }) => {
    if (isRevealed) return <span className="text-slate-100 font-medium">{text}</span>;
    return <span className="text-slate-500 tracking-widest font-mono">••••••••••••</span>;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={toggleReveal}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          title={isRevealed ? "Hide details" : "Reveal details"}
        >
          {isRevealed ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-600 shadow-lg">
             {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                    {profile.name.charAt(0)}
                </div>
             )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-900 rounded-full p-1.5 border-2 border-slate-800">
             <Shield size={16} />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h2>
          
          <div className="grid gap-2 text-sm text-slate-400">
            <div className="flex items-center justify-center sm:justify-start gap-2">
                <Briefcase size={14} className="text-indigo-400"/>
                <EncryptedText text={profile.occupation} />
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin size={14} className="text-indigo-400"/>
                <EncryptedText text={profile.location} />
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail size={14} className="text-indigo-400"/>
                <EncryptedText text={profile.email} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default ProfileCard;