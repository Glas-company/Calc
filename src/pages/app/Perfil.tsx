import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, HelpCircle, ChevronRight, LogOut, Pencil, Check, X, ShieldCheck, Crown, Star, Calculator, History, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/userProfile";
import { getUserStats, UserStats } from "@/lib/userStats";
import { getAvatarUrl } from "@/lib/avatarService";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Perfil() {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { profile } = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
          setEditedName(profile.fullName);
        }

        const { stats } = await getUserStats();
        if (stats) {
          setUserStats(stats);
        }

        const avatar = await getAvatarUrl();
        setAvatarUrl(avatar);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    navigate("/auth/login", { replace: true });
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      toast({
        title: "Erro",
        description: "O nome não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingName(true);
    const { error } = await saveUserProfile({ fullName: editedName.trim(), companyName: userProfile?.companyName || "" });
    setIsSavingName(false);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o nome.",
        variant: "destructive",
      });
    } else {
      setUserProfile((prev) => prev ? { ...prev, fullName: editedName.trim() } : null);
      setIsEditingName(false);
      toast({
        title: "Sucesso",
        description: "Nome atualizado com sucesso!",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userProfile?.fullName || "");
    setIsEditingName(false);
  };

  const handleAvatarChange = (newUrl: string | null) => {
    setAvatarUrl(newUrl);
  };

  return (
    <div className="pt-4 pb-24 animate-fade-in space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-[24px] font-black tracking-tight text-[#1a1a1a]">emerald</h1>
        <button 
          onClick={() => navigate("/app/configuracoes")}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center active:scale-90 transition-all"
        >
          <Settings size={22} className="text-[#1a1a1a]" />
        </button>
      </div>

      {/* Profile Header Section */}
      <div className="flex flex-col items-center">
        {/* Avatar with Circular Border */}
        <div className="relative mb-6">
          <div className="absolute inset-0 -m-2 border-2 border-emerald-500 rounded-full clip-path-half" /> {/* Mock progress circle */}
          <AvatarPicker
            avatarUrl={avatarUrl}
            onAvatarChange={handleAvatarChange}
            size="xl"
            showControls={false}
          />
          <button 
            onClick={() => navigate("/app/perfil")} // Should ideally trigger photo change
            className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white"
          >
            <Pencil size={14} fill="currentColor" />
          </button>
        </div>

        {/* Name and Info */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-10 text-center font-bold text-[24px] w-48 border-none bg-transparent focus-visible:ring-0"
                  autoFocus
                />
                <button onClick={handleSaveName} disabled={isSavingName} className="text-emerald-500"><Check size={20} /></button>
                <button onClick={handleCancelEdit} className="text-red-500"><X size={20} /></button>
              </div>
            ) : (
              <>
                <h2 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight" onClick={() => setIsEditingName(true)}>
                  {userProfile?.fullName?.split(" ")[0] || "Usuário"}, 28
                </h2>
                <ShieldCheck size={22} className="text-blue-500 fill-blue-500 text-white" />
              </>
            )}
          </div>
          <p className="text-[#8a8a8a] font-medium text-[15px]">{userProfile?.companyName || "Piloto de Drones"}</p>
        </div>
      </div>

      {/* Completion Status Card */}
      <div className="px-2">
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
              <span className="text-[14px] font-bold text-emerald-600">60%</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-500" strokeDasharray="150.79" strokeDashoffset="60.3" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#1a1a1a]">Complete seu perfil</p>
              <p className="text-[13px] text-[#8a8a8a]">Para ter mais visibilidade</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditingName(true)}
            className="px-5 py-2.5 rounded-full border border-[#1a1a1a] text-[14px] font-bold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Main Upgrade Card */}
      <div className="px-2">
        <div className="bg-[#f2f4f7] rounded-[32px] p-8 flex flex-col gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-[22px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Crown size={32} className="text-white fill-white/20" />
            </div>
            <div className="flex-1">
              <h3 className="text-[22px] font-bold text-[#1a1a1a]">Emerald Pro</h3>
              <p className="text-[15px] text-[#1a1a1a]/60 font-medium leading-snug">Tenha acesso a relatórios avançados e IA exclusiva.</p>
            </div>
          </div>
          <button className="bg-[#1a1a1a] text-white rounded-full py-4 text-[16px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-black/10">
            <Plus size={20} /> Upgrade para Pro
          </button>
        </div>
      </div>

      {/* Stats and Items List */}
      <div className="px-2 space-y-1">
        <div className="p-4 flex items-center justify-between group active:bg-gray-50 rounded-2xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <Star size={24} className="text-amber-500 fill-amber-500/20" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#1a1a1a]">{userStats?.totalCalculations || 0} Cálculos</p>
              <p className="text-[13px] text-[#8a8a8a] font-medium">Histórico total de trabalho</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </div>

        <div className="w-full h-px bg-gray-100 mx-4" />

        <div className="p-4 flex items-center justify-between group active:bg-gray-50 rounded-2xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <History size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#1a1a1a]">{userStats?.savedCalculations || 0} Salvos</p>
              <p className="text-[13px] text-[#8a8a8a] font-medium">Misturas e receitas favoritas</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </div>

        <div className="w-full h-px bg-gray-100 mx-4" />

        <div className="p-4 flex items-center justify-between group active:bg-gray-50 rounded-2xl transition-all" onClick={() => navigate("/app/ajuda")}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <HelpCircle size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#1a1a1a]">Ajuda & Suporte</p>
              <p className="text-[13px] text-[#8a8a8a] font-medium">Tire suas dúvidas agora</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 pt-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 text-[15px] font-bold text-red-500 bg-red-50 py-4 rounded-2xl active:scale-95 transition-all"
        >
          <LogOut size={18} />
          {isLoggingOut ? "Saindo..." : "Sair da conta"}
        </button>
      </div>
    </div>
  );
}
