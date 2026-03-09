
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplets, 
  Users, 
  AlertTriangle, 
  Map as MapIcon, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Zap,
  Clock,
  Navigation,
  CheckCircle2,
  BrainCircuit,
  Smartphone,
  ShieldCheck,
  Thermometer,
  Sun,
  Battery,
  QrCode,
  ArrowRight,
  Filter,
  Truck
} from 'lucide-react';
import { 
  UserRole, 
  BloodGroup, 
  BloodStock, 
  Donor, 
  Emergency, 
  PredictionResult, 
  SmartCooler, 
  BloodPouch,
  BloodDonation,
  LabTest,
  BloodComponent,
  TransfusionRequest,
  LogisticsDispatch
} from './types';
import { 
  MOCK_USER, 
  MOCK_STOCKS, 
  MOCK_DONORS, 
  MOCK_EMERGENCIES, 
  MOCK_COOLERS, 
  MOCK_POUCHES,
  MOCK_DONATIONS,
  MOCK_LAB_TESTS,
  MOCK_COMPONENTS,
  MOCK_TRANSFUSION_REQUESTS,
  MOCK_LOGISTICS_DISPATCHES
} from './mockData';
import { predictShortage } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';

// --- Subcomponents ---

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active ? 'bg-red-600 text-white shadow-lg shadow-red-200 font-semibold' : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    'OK': 'bg-green-100 text-green-700',
    'CRITICAL': 'bg-orange-100 text-orange-700',
    'EMPTY': 'bg-red-100 text-red-700',
    'STABLE': 'bg-green-100 text-green-700',
    'WARNING': 'bg-orange-100 text-orange-700',
    'PENDING': 'bg-blue-100 text-blue-700',
    'COMPLETED': 'bg-slate-100 text-slate-700',
    'AVAILABLE': 'bg-emerald-100 text-emerald-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${colors[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'donors' | 'screening' | 'collection' | 'lab' | 'processing' | 'stock' | 'transfusion' | 'emergency' | 'ai' | 'coolers' | 'traceability'>('dashboard');
  const [stocks] = useState<BloodStock[]>(MOCK_STOCKS);
  const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS);
  const [emergencies, setEmergencies] = useState<Emergency[]>(MOCK_EMERGENCIES);
  const [coolers] = useState<SmartCooler[]>(MOCK_COOLERS);
  const [donations, setDonations] = useState<BloodDonation[]>(MOCK_DONATIONS);
  const [labTests, setLabTests] = useState<LabTest[]>(MOCK_LAB_TESTS);
  const [components, setComponents] = useState<BloodComponent[]>(MOCK_COMPONENTS);
  const [transfusionRequests, setTransfusionRequests] = useState<TransfusionRequest[]>(MOCK_TRANSFUSION_REQUESTS);
  const [dispatches, setDispatches] = useState<LogisticsDispatch[]>(MOCK_LOGISTICS_DISPATCHES);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(1800);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [selectedDonorForScreening, setSelectedDonorForScreening] = useState<Donor | null>(null);

  useEffect(() => {
    let timer: any;
    if (emergencyActive && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emergencyActive, countdown]);

  const handlePredict = async () => {
    setIsAiLoading(true);
    const result = await predictShortage(stocks);
    setPrediction(result);
    setIsAiLoading(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const triggerEmergency = () => {
    setEmergencyActive(true);
    setCountdown(1800);
    const newEmergency: Emergency = {
      id: `e${Date.now()}`,
      hospitalName: 'Centre Médical Congo',
      bloodGroup: 'O-',
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      location: { lat: -4.2634, lng: 15.2429 }
    };
    setEmergencies([newEmergency, ...emergencies]);
  };

  // --- View Renderers ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Stock National</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">2,410 <span className="text-xs font-medium text-slate-400 uppercase">Poches</span></h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Droplets size={24} /></div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-xs font-bold">
            <Activity size={14} className="mr-1" /> +12.4% vs semaine dernière
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Donneurs Inscrits</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">12.5k</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={24} /></div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 text-xs font-bold">
            <Smartphone size={14} className="mr-1" /> 842 via App Mobile
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Glacières IoT</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">42 <span className="text-xs font-medium text-slate-400 uppercase">Actives</span></h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Sun size={24} /></div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-xs font-bold">
            <Battery size={14} className="mr-1" /> 98% Autonomie Solaire
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Urgences 30m</p>
              <h3 className="text-3xl font-black text-red-600 mt-1">{emergencies.filter(e => e.status === 'PENDING').length}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Zap size={24} /></div>
          </div>
          <div className="mt-4 flex items-center text-red-600 text-xs font-bold">
            <Clock size={14} className="mr-1" /> Tps moy. réponse: 22min
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Distribution Groupes Sanguins</h3>
            <div className="flex items-center space-x-2">
               <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Filter size={18}/></button>
               <select className="bg-slate-50 border-none text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl outline-none">
                <option>Tout le pays</option>
                <option>Brazzaville</option>
              </select>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stocks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                  {stocks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'OK' ? '#3b82f6' : entry.status === 'CRITICAL' ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Suivi IoT Temps Réel</h3>
          <div className="space-y-5 flex-1 overflow-y-auto">
            {coolers.map(c => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${c.status === 'STABLE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <Thermometer size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{c.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{c.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${c.status === 'STABLE' ? 'text-green-600' : 'text-red-600'}`}>{c.temperature}°C</p>
                    <div className="flex items-center justify-end text-[10px] font-bold text-slate-400">
                      <Battery size={10} className="mr-1" /> {c.batteryLevel}%
                      {c.isSolarCharging && <Sun size={10} className="ml-1 text-orange-400" />}
                    </div>
                  </div>
                </div>
                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-500 ${c.status === 'STABLE' ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${(c.capacity/15)*100}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('coolers')} className="mt-6 w-full py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors">Voir tout le parc IoT</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
            <Clock size={20} className="mr-2 text-blue-500" /> Activité Récente du Cycle
          </h3>
          <div className="space-y-6">
            {donations.slice(0, 4).map(don => (
              <div key={don.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-red-600 shadow-sm">
                    {don.bloodGroup || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Donation {don.pouchId}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{don.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-800">{new Date(don.collectionDate).toLocaleDateString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{don.volume}ml</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
            <Activity size={20} className="mr-2 text-emerald-500" /> État des Tests Labo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
              <p className="text-3xl font-black text-emerald-600">{labTests.filter(t => t.status === 'COMPLETED').length}</p>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Tests Terminés</p>
            </div>
            <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 text-center">
              <p className="text-3xl font-black text-orange-600">{labTests.filter(t => t.status === 'PENDING').length}</p>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-1">En Attente</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center">
              <p className="text-3xl font-black text-blue-600">{components.length}</p>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Composants Prêts</p>
            </div>
            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 text-center">
              <p className="text-3xl font-black text-red-600">{transfusionRequests.filter(r => r.status === 'PENDING').length}</p>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-1">Commandes Ouvertes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Truck size={40} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">Logistique Automatisée</h3>
              <p className="text-slate-400 font-medium">Suivi en temps réel des {dispatches.length} livraisons actives</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="text-center px-6 border-r border-white/10">
              <p className="text-2xl font-black text-blue-400">98%</p>
              <p className="text-[10px] font-black text-slate-500 uppercase">Ponctualité</p>
            </div>
            <div className="text-center px-6">
              <p className="text-2xl font-black text-emerald-400">18 min</p>
              <p className="text-[10px] font-black text-slate-500 uppercase">Temps Moyen</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('logistics')} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all">
            GÉRER LA FLOTTE
          </button>
        </div>
      </div>
    </div>
  );

  const renderStock = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-500">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Gestion d'Inventaire</h3>
          <p className="text-slate-500 font-medium">Monitoring des stocks par établissement</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher hôpital..." 
              className="pl-12 pr-6 py-3 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-red-500 outline-none w-64 shadow-inner" 
            />
          </div>
          <button className="bg-slate-800 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-900 transition-all flex items-center">
            <QrCode size={18} className="mr-2" /> Scanner Pouch
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Établissement</th>
              <th className="px-8 py-5">Groupe</th>
              <th className="px-8 py-5 text-center">Niveau Actuel</th>
              <th className="px-8 py-5">État de Santé</th>
              <th className="px-8 py-5">Dernier Mouvement</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stocks.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-800">{s.hospitalName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Hôpital Régional</p>
                </td>
                <td className="px-8 py-6">
                   <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-lg shadow-sm">
                    {s.group}
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xl font-black text-slate-800">{s.quantity} units</span>
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${s.status === 'OK' ? 'bg-blue-500' : s.status === 'CRITICAL' ? 'bg-orange-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(s.quantity * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6"><StatusBadge status={s.status} /></td>
                <td className="px-8 py-6 text-slate-500 text-xs font-medium">Il y a {Math.floor(Math.random() * 59) + 1} min</td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-300 hover:text-red-600 transition-colors hover:bg-red-50 rounded-xl">
                    <ArrowRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCoolers = () => (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Parc de Glacières Solaire IoT</h2>
        <div className="flex space-x-2">
           <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center"><MapIcon size={16} className="mr-2" /> Vue Carte</button>
           <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center"><Sun size={16} className="mr-2" /> Mode Solaire</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {coolers.map(c => (
          <div key={c.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 ${c.status === 'STABLE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-black text-slate-800">{c.name}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{c.location}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Température</p>
                 <div className="flex items-center text-2xl font-black text-slate-800">
                    <Thermometer className={`mr-1 ${c.temperature > 8 ? 'text-red-500' : 'text-blue-500'}`} size={20} />
                    {c.temperature}°C
                 </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Energie</p>
                 <div className="flex items-center text-2xl font-black text-slate-800">
                    <Battery className={`mr-1 ${c.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} size={20} />
                    {c.batteryLevel}%
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Occupation (Poches)</span>
                  <span className="text-slate-800">{c.capacity} / 15</span>
               </div>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-blue-500 rounded-full" style={{width: `${(c.capacity/15)*100}%`}}></div>
               </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center text-xs font-black text-orange-500 uppercase">
                {c.isSolarCharging && <><Sun size={14} className="mr-1 animate-spin-slow" /> Charge Solaire Active</>}
              </div>
              <button className="text-blue-600 text-xs font-bold hover:underline">Ouvrir télémétrie</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTraceability = () => (
    <div className="space-y-8 animate-in slide-in-from-left duration-500">
      <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <ShieldCheck className="text-emerald-400" size={16} />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-100">Blockchain Verify - Congo Node #12</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-tight">Traçabilité Immuable des Unités Sanguines</h2>
            <p className="text-slate-400 text-lg">Scannez le code QR d'une poche pour vérifier son origine, ses tests et sa chaîne du froid de bout en bout.</p>
            <div className="flex items-center space-x-4">
              <input 
                type="text" 
                placeholder="Entrez ID de la poche (ex: POUCH-O-9921)" 
                className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all text-white placeholder:text-slate-600 font-mono"
              />
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center">
                <QrCode size={20} className="mr-2" /> Scanner
              </button>
            </div>
          </div>
          <div className="hidden lg:block bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Dernière transaction</h4>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">POUCH_ID</span>
                <span className="text-emerald-400">MNG-A-2023-X9</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">TIMESTAMP</span>
                <span>2023-10-27 14:32:01</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">LOCATION_HASH</span>
                <span className="text-blue-400 truncate ml-4">0xc42e...88ab</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500">TEMP_LOG</span>
                <span className="text-green-400">STABLE (4.1°C)</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Verified by Hyperledger Fabric</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-800">Historique de l'Unité : {MOCK_POUCHES[0].id}</h3>
          <div className="space-y-4">
            {MOCK_POUCHES[0].history.map((h, i) => (
              <div key={i} className="flex space-x-6 group">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-all group-hover:scale-110 ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {i === 0 ? <CheckCircle2 size={20}/> : <Clock size={20}/>}
                  </div>
                  {i < MOCK_POUCHES[0].history.length - 1 && <div className="w-0.5 h-16 bg-slate-100 my-1"></div>}
                </div>
                <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-800 text-lg">{h.action}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(h.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-medium text-slate-500 mb-4">
                    <span className="flex items-center"><MapIcon size={12} className="mr-1" /> {h.location}</span>
                    <span className="flex items-center"><Users size={12} className="mr-1" /> {h.actor}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-xl">
                    <span className="font-mono text-slate-400">HASH: {h.hash}</span>
                    <button className="text-blue-600 font-bold hover:underline uppercase tracking-widest">Détails</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <h4 className="text-lg font-black text-slate-800 mb-6">Détails de la Poche</h4>
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Groupe</span>
                  <span className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">{MOCK_POUCHES[0].group}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Collecté le</span>
                  <span className="text-sm font-black text-slate-800">{MOCK_POUCHES[0].collectionDate}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Expire le</span>
                  <span className="text-sm font-black text-red-600">{MOCK_POUCHES[0].expiryDate}</span>
               </div>
               <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-400">Statut</span>
                  <StatusBadge status={MOCK_POUCHES[0].status} />
               </div>
             </div>
             <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all">Télécharger Certificat</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreening = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Entretien Médical (Pré-don)</h3>
          <p className="text-slate-500 font-medium">Évaluation de l'éligibilité des donneurs</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Donneurs en attente</h4>
          <div className="space-y-3">
            {donors.filter(d => d.eligibilityStatus === 'PENDING').length === 0 && (
              <p className="text-slate-400 text-sm italic">Aucun donneur en attente d'entretien.</p>
            )}
            {donors.filter(d => d.eligibilityStatus === 'PENDING').map(d => (
              <button 
                key={d.id}
                onClick={() => setSelectedDonorForScreening(d)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center space-x-3 ${selectedDonorForScreening?.id === d.id ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:border-red-200'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">{d.bloodGroup}</div>
                <div>
                  <p className="font-bold text-slate-800">{d.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{d.city}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDonorForScreening ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-2xl">{selectedDonorForScreening.bloodGroup}</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800">{selectedDonorForScreening.name}</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Né le {selectedDonorForScreening.dateOfBirth}</p>
                  </div>
                </div>
                <StatusBadge status={selectedDonorForScreening.eligibilityStatus} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Poids (kg)</span>
                    <input type="number" defaultValue={selectedDonorForScreening.weight} className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tension Artérielle</span>
                    <input type="text" placeholder="120/80" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Température (°C)</span>
                    <input type="number" step="0.1" placeholder="36.5" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
                  </label>
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Questionnaire Rapide</p>
                      <div className="space-y-2">
                        {['Maladies récentes ?', 'Médicaments en cours ?', 'Voyage récent ?'].map((q, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">{q}</span>
                            <div className="flex space-x-2">
                               <button className="px-2 py-1 bg-white rounded-lg text-[10px] font-black border border-slate-200">OUI</button>
                               <button className="px-2 py-1 bg-white rounded-lg text-[10px] font-black border border-slate-200">NON</button>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setDonors(donors.map(d => d.id === selectedDonorForScreening.id ? {...d, eligibilityStatus: 'ELIGIBLE'} : d));
                    setSelectedDonorForScreening(null);
                  }}
                  className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                >
                  DÉCLARER ÉLIGIBLE
                </button>
                <button 
                  onClick={() => {
                    setDonors(donors.map(d => d.id === selectedDonorForScreening.id ? {...d, eligibilityStatus: 'INELIGIBLE'} : d));
                    setSelectedDonorForScreening(null);
                  }}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  DÉCLARER INÉLIGIBLE
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-100/50 rounded-[40px] border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                <ShieldCheck size={40} />
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2">Sélectionnez un donneur</h4>
              <p className="text-slate-400 max-w-xs mx-auto">Veuillez choisir un donneur dans la liste de gauche pour commencer l'entretien médical.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCollection = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Prélèvement de Sang</h3>
          <p className="text-slate-500 font-medium">Enregistrement des nouveaux dons et génération d'IDs</p>
        </div>
        <button className="bg-red-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-red-700 transition-all flex items-center shadow-lg shadow-red-100">
          <Droplets size={18} className="mr-2" /> Nouveau Prélèvement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Derniers Prélèvements</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID Poche</th>
                  <th className="px-6 py-4">Donneur</th>
                  <th className="px-6 py-4">Volume</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{d.bagId}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{donors.find(donor => donor.id === d.donorId)?.name}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{d.volumeMl} ml</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{d.donationDate}</td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h4 className="text-lg font-black mb-6 relative z-10">Générer Étiquette QR</h4>
              <div className="bg-white p-6 rounded-3xl flex flex-col items-center space-y-4">
                 <div className="w-40 h-40 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <QrCode size={80} className="text-slate-800" />
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BAG-ID UNIQUE</p>
                    <p className="text-xl font-black text-slate-900 font-mono">BZV-2026-000452</p>
                 </div>
                 <button className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">Imprimer Étiquette</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderLab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Analyses Biologiques</h3>
          <p className="text-slate-500 font-medium">Dépistage des maladies transmissibles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Poches à analyser</h4>
              <div className="space-y-2">
                 {donations.filter(d => d.status === 'COLLECTED' || d.status === 'TESTING').map(d => (
                   <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                      <span className="font-mono text-xs font-bold">{d.bagId}</span>
                      <button className="text-blue-600 text-[10px] font-black uppercase">Analyser</button>
                   </div>
                 ))}
                 {donations.filter(d => d.status === 'COLLECTED' || d.status === 'TESTING').length === 0 && (
                   <p className="text-slate-400 text-xs italic">Aucune poche en attente.</p>
                 )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-slate-800">Résultats du Test : BAG-BZV-002</h4>
              <StatusBadge status="PENDING" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'VIH / SIDA', key: 'hiv' },
                { label: 'Hépatite B', key: 'hepatitisB' },
                { label: 'Hépatite C', key: 'hepatitisC' },
                { label: 'Syphilis', key: 'syphilis' },
                { label: 'Paludisme', key: 'malaria' }
              ].map(test => (
                <div key={test.key} className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{test.label}</p>
                   <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black hover:bg-emerald-50 hover:border-emerald-200 transition-all">NÉGATIF</button>
                      <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black hover:bg-red-50 hover:border-red-200 transition-all">POSITIF</button>
                   </div>
                </div>
              ))}
           </div>

           <div className="flex space-x-4">
              <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">VALIDER COMME SAIN (SAFE)</button>
              <button className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100">MARQUER COMME INFECTÉ</button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Séparation des Composants</h3>
          <p className="text-slate-500 font-medium">Transformation des poches de sang total en produits médicaux</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
           <h4 className="text-lg font-black text-slate-800 mb-6">Centrifugeuse #1</h4>
           <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-3xl font-black text-slate-800">3,500</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase">RPM</span>
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400">Progression</span>
                 <span className="text-blue-600">65%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500" style={{width: '65%'}}></div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
           <h4 className="text-xl font-black text-slate-800 mb-8">Composants Générés</h4>
           <div className="space-y-4">
              {[
                { type: 'Globules Rouges (RBC)', temp: '2° à 6°C', duration: '42 jours', color: 'bg-red-500' },
                { type: 'Plasma', temp: '-25°C', duration: '1 an', color: 'bg-yellow-400' },
                { type: 'Plaquettes', temp: '20° à 24°C', duration: '5 jours', color: 'bg-blue-400' }
              ].map((comp, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-blue-100 transition-all">
                   <div className="flex items-center space-x-4">
                      <div className={`w-3 h-12 rounded-full ${comp.color}`}></div>
                      <div>
                         <p className="font-black text-slate-800">{comp.type}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conservation: {comp.temp} | {comp.duration}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest">ID: COMP-00{i+1}</p>
                      <button className="mt-1 text-[10px] font-black text-slate-400 hover:text-red-600">Imprimer ID</button>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all">FINALISER LA SÉPARATION</button>
        </div>
      </div>
    </div>
  );

  const renderTransfusion = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      {showOrderForm ? (
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nouvelle Commande Numérique</h3>
            <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-red-600 font-bold">Annuler</button>
          </div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowOrderForm(false); }}>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Hôpital</span>
                <select className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>CHU de Brazzaville</option>
                  <option>Hôpital de Loandjili</option>
                  <option>Clinique Netcare</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Patient ID</span>
                <input type="text" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: PAT-2023-001" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Groupe Sanguin</span>
                <select className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>O-</option>
                  <option>O+</option>
                  <option>A-</option>
                  <option>A+</option>
                  <option>B-</option>
                  <option>B+</option>
                  <option>AB-</option>
                  <option>AB+</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Composant</span>
                <select className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>RBC (Globules Rouges)</option>
                  <option>PLASMA</option>
                  <option>PLATELETS (Plaquettes)</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantité (Unités)</span>
              <input type="number" min="1" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="1" />
            </label>
            <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100">ENVOYER LA COMMANDE</button>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Commandes Numériques</h2>
              <p className="text-slate-500 font-medium">Gestion des requêtes hospitalières et matching</p>
            </div>
            <button 
              onClick={() => setShowOrderForm(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-black transition-all flex items-center shadow-lg"
            >
              <ArrowRight size={18} className="mr-2" /> Nouvelle Demande
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               {transfusionRequests.map(req => (
                 <div key={req.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-md transition-all">
                    <div className="flex items-center space-x-6">
                       <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center font-black text-2xl shadow-inner">
                          {req.bloodGroup}
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-slate-800">Patient ID: {req.patientId}</h4>
                          <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                             <span>{req.componentType}</span>
                             <span>•</span>
                             <span>{req.quantity} Unités</span>
                             <span>•</span>
                             <span className="text-blue-600">CHU Brazzaville</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <StatusBadge status={req.status} />
                       <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all">
                          <ArrowRight size={20} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>

            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                  <h4 className="text-lg font-black text-slate-800 mb-6">Matching Intelligent</h4>
                  <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-4">
                     <div className="flex items-center space-x-3">
                        <BrainCircuit size={24} className="text-blue-600" />
                        <p className="text-sm font-black text-blue-900">Algorithme de Matching</p>
                     </div>
                     <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        Recherche automatique de compatibilité (Groupe + Composant) dans les banques les plus proches.
                     </p>
                     <div className="pt-4 border-t border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-black text-blue-400 uppercase">Stock trouvé</span>
                           <span className="text-xs font-black text-blue-900">CNTS Bacongo</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-blue-400 uppercase">Distance</span>
                           <span className="text-xs font-black text-blue-900">3.2 km</span>
                        </div>
                     </div>
                  </div>
                  <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">DÉPÊCHER L'UNITÉ</button>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderLogistics = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Logistique Automatisée</h2>
          <p className="text-slate-500 font-medium">Suivi en temps réel des livraisons et dispatching</p>
        </div>
        <div className="flex space-x-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center">
            <Truck size={16} className="text-blue-500 mr-2" />
            <span className="text-xs font-black text-slate-700 uppercase">{dispatches.length} En cours</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {dispatches.map(disp => (
            <div key={disp.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">Livraison {disp.id}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase">Poche: {disp.pouchId}</p>
                  </div>
                </div>
                <StatusBadge status={disp.status} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Coursier</p>
                  <p className="text-sm font-bold text-slate-800">{disp.courierName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Téléphone</p>
                  <p className="text-sm font-bold text-slate-800">{disp.courierPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Arrivée Est.</p>
                  <p className="text-sm font-bold text-slate-800">{new Date(disp.estimatedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Destination</p>
                  <p className="text-sm font-bold text-slate-800">CHU Brazzaville</p>
                </div>
              </div>

              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: disp.status === 'DELIVERED' ? '100%' : disp.status === 'IN_TRANSIT' ? '65%' : '15%' }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Collecte</span>
                <span>En transit</span>
                <span>Livré</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h4 className="text-lg font-black mb-6 flex items-center">
              <Navigation size={20} className="mr-2 text-blue-400" /> Dispatching Auto
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Algorithme de Route</p>
                <p className="text-xs font-bold text-slate-300">Optimisation via trafic temps réel et urgence vitale.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Coursiers Disponibles</p>
                <p className="text-2xl font-black text-blue-400">12</p>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all">CONFIGURER LOGISTIQUE</button>
          </div>
        </div>
      </div>
    </div>
  );
  const renderDonors = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      {showDonorForm ? (
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Inscription Nouveau Donneur</h3>
            <button onClick={() => setShowDonorForm(false)} className="text-slate-400 hover:text-red-600 font-bold">Annuler</button>
          </div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowDonorForm(false); }}>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Nom</span>
                <input type="text" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Mbemba" />
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Prénom</span>
                <input type="text" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Ex: Alice" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Date de Naissance</span>
                <input type="date" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sexe</span>
                <select className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>Masculin</option>
                  <option>Féminin</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Groupe Sanguin</span>
                <select className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>Inconnu</option>
                  <option>O-</option>
                  <option>O+</option>
                  <option>A-</option>
                  <option>A+</option>
                  <option>B-</option>
                  <option>B+</option>
                  <option>AB-</option>
                  <option>AB+</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Téléphone</span>
                <input type="tel" className="mt-1 block w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="+242 06 ..." />
              </label>
            </div>
            <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100">ENREGISTRER LE DONNEUR</button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Base de Données Donneurs</h3>
              <p className="text-slate-500 font-medium">Gestion et mobilisation des donneurs volontaires</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un donneur..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-red-500 outline-none w-64 shadow-inner" 
                />
              </div>
              <button 
                onClick={() => setShowDonorForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-red-700 transition-all flex items-center shadow-lg shadow-red-100"
              >
                <Users size={18} className="mr-2" /> Nouveau Donneur
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Donneur</th>
                  <th className="px-8 py-5">Groupe</th>
                  <th className="px-8 py-5">Localisation</th>
                  <th className="px-8 py-5">Fiabilité</th>
                  <th className="px-8 py-5">Éligibilité</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.city.toLowerCase().includes(searchQuery.toLowerCase())).map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <img src={`https://picsum.photos/seed/${d.id}/40/40`} className="w-10 h-10 rounded-xl" alt="" />
                        <div>
                          <p className="font-bold text-slate-800">{d.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {d.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-sm">
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-slate-500 text-sm font-medium">
                        <MapIcon size={14} className="mr-1" /> {d.city}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${d.reliabilityScore}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-slate-800">{d.reliabilityScore}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={d.eligibilityStatus} />
                    </td>
                    <td className="px-8 py-6">
                       <button className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                          <QrCode size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderAi = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full -mr-64 -mt-64 blur-[100px] animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 bg-white/10 rounded-[30px] flex items-center justify-center backdrop-blur-xl border border-white/20">
            <BrainCircuit size={40} className="text-blue-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter leading-tight">MENGA <span className="text-blue-400">Predictive IA</span></h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Utilisez la puissance de Gemini pour anticiper les besoins en sang basés sur les données hospitalières, la saisonnalité et les risques locaux.
            </p>
          </div>
          <button 
            onClick={handlePredict}
            disabled={isAiLoading}
            className={`px-10 py-5 rounded-3xl text-xl font-black transition-all flex items-center shadow-2xl ${
              isAiLoading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-white text-slate-900 hover:bg-blue-50 hover:scale-105 active:scale-95'
            }`}
          >
            {isAiLoading ? (
              <><Activity className="mr-3 animate-spin" size={24} /> Analyse en cours...</>
            ) : (
              <><Zap className="mr-3 text-blue-600" size={24} /> Lancer l'IA Prédictive</>
            )}
          </button>
        </div>
      </div>

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">Analyse des Risques</h4>
              <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${
                prediction.riskLevel === 'HIGH' ? 'bg-red-100 text-red-600' : 
                prediction.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-600' : 
                'bg-green-100 text-green-600'
              }`}>
                RISQUE {prediction.riskLevel}
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pénuries Prédites</p>
                <div className="flex flex-wrap gap-3">
                  {prediction.predictedShortage.map(g => (
                    <span key={g} className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xl border border-red-100 shadow-sm">{g}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Analyse Détaillée</p>
                <div className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 border-l-4 border-l-blue-500">
                  {prediction.reasoning}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col">
            <h4 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Plan d'Action Recommandé</h4>
            <div className="space-y-4 flex-1">
              {prediction.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-center space-x-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black shrink-0">
                    {i + 1}
                  </div>
                  <p className="font-bold text-slate-700">{action}</p>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all flex items-center justify-center">
              Déployer les Recommandations <ArrowRight className="ml-3" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 h-full p-8">
        <div className="flex items-center space-x-3 px-4 mb-12">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-200">
            <Droplets size={28} />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter block leading-none">MENGA</span>
            <span className="text-[10px] font-black text-red-600 tracking-widest uppercase opacity-70">Blood Systems</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 mt-4">Vue d'ensemble</p>
          <SidebarItem icon={<Activity size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 mt-6">Cycle du Sang</p>
          <SidebarItem icon={<Users size={18} />} label="Donneurs" active={activeTab === 'donors'} onClick={() => setActiveTab('donors')} />
          <SidebarItem icon={<ShieldCheck size={18} />} label="Entretien Médical" active={activeTab === 'screening'} onClick={() => setActiveTab('screening')} />
          <SidebarItem icon={<Droplets size={18} />} label="Prélèvement" active={activeTab === 'collection'} onClick={() => setActiveTab('collection')} />
          <SidebarItem icon={<Activity size={18} />} label="Laboratoire" active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} />
          <SidebarItem icon={<Filter size={18} />} label="Séparation" active={activeTab === 'processing'} onClick={() => setActiveTab('processing')} />
          <SidebarItem icon={<Droplets size={18} />} label="Stock & Inventaire" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
          <SidebarItem icon={<ArrowRight size={18} />} label="Transfusion" active={activeTab === 'transfusion'} onClick={() => setActiveTab('transfusion')} />
          <SidebarItem icon={<Truck size={18} />} label="Logistique" active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 mt-6">Innovation & Urgence</p>
          <SidebarItem icon={<Zap size={18} />} label="Urgence Vitale" active={activeTab === 'emergency'} onClick={() => setActiveTab('emergency')} />
          <SidebarItem icon={<Sun size={18} />} label="Suivi IoT Solaire" active={activeTab === 'coolers'} onClick={() => setActiveTab('coolers')} />
          <SidebarItem icon={<ShieldCheck size={18} />} label="Traçabilité" active={activeTab === 'traceability'} onClick={() => setActiveTab('traceability')} />
          <SidebarItem icon={<BrainCircuit size={18} />} label="Predictive IA" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-100 space-y-2">
          <div className="bg-red-50 p-4 rounded-2xl mb-6">
             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Aide d'Urgence</p>
             <p className="text-xs text-red-800 font-bold">Contactez le centre national : <span className="block mt-1 font-black text-lg">+242 06 999 00 00</span></p>
          </div>
          <SidebarItem icon={<Settings size={20} />} label="Paramètres" onClick={() => {}} />
          <SidebarItem icon={<LogOut size={20} />} label="Déconnexion" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="lg:hidden flex items-center space-x-3">
             <Droplets className="text-red-600" size={28} />
             <span className="font-black text-2xl tracking-tighter">MENGA</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
               <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
               <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Network Live: Congo</span>
            </div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl relative transition-all hover:text-red-600">
              <Bell size={24} />
              <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-4 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-tight">{MOCK_USER.name}</p>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{MOCK_USER.role}</p>
              </div>
              <div className="relative group cursor-pointer">
                <img src="https://picsum.photos/seed/admin-user/100/100" className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-red-50 transition-all shadow-md" alt="profile" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 pb-32">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'stock' && renderStock()}
          {activeTab === 'donors' && renderDonors()}
          {activeTab === 'screening' && renderScreening()}
          {activeTab === 'collection' && renderCollection()}
          {activeTab === 'lab' && renderLab()}
          {activeTab === 'processing' && renderProcessing()}
          {activeTab === 'transfusion' && renderTransfusion()}
          {activeTab === 'logistics' && renderLogistics()}
          {activeTab === 'coolers' && renderCoolers()}
          {activeTab === 'traceability' && renderTraceability()}
          {activeTab === 'ai' && renderAi()}
          {activeTab === 'emergency' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
              {/* Reuse of previous App.tsx renderEmergency but enhanced is handled inside same file logic */}
              <div className="max-w-5xl mx-auto space-y-10">
                <div className={`p-12 rounded-[50px] border-4 transition-all duration-700 ${emergencyActive ? 'bg-red-600 border-white/20 shadow-2xl shadow-red-500/50' : 'bg-white border-slate-100'}`}>
                  <div className="text-center space-y-6">
                    <div className={`mx-auto w-32 h-32 rounded-[40px] flex items-center justify-center transition-all duration-700 ${emergencyActive ? 'bg-white text-red-600 rotate-12 scale-110' : 'bg-red-50 text-red-600'}`}>
                      <Zap size={64} fill={emergencyActive ? "currentColor" : "none"} />
                    </div>
                    <h2 className={`text-5xl font-black tracking-tighter ${emergencyActive ? 'text-white' : 'text-slate-900'}`}>URGENCE VITALE <span className="text-red-600 text-3xl">{emergencyActive ? '' : '30M'}</span></h2>
                    <p className={`max-w-xl mx-auto text-xl font-medium leading-relaxed ${emergencyActive ? 'text-red-100' : 'text-slate-500'}`}>
                      Activation du protocole de matching instantané. Mobilisation des donneurs et coursiers Express 
                      <span className="font-black border-b-2 border-red-500 ml-1">MENGA Safe-Chain</span>.
                    </p>

                    {!emergencyActive ? (
                      <button 
                        onClick={triggerEmergency}
                        className="mt-8 bg-red-600 text-white px-16 py-6 rounded-3xl text-2xl font-black hover:bg-red-700 transition-all shadow-2xl shadow-red-200 hover:scale-105 active:scale-95 flex items-center mx-auto group"
                      >
                        Lancer l'alerte <ArrowRight className="ml-4 transition-transform group-hover:translate-x-2" size={32} />
                      </button>
                    ) : (
                      <div className="space-y-10">
                        <div className="flex flex-col items-center">
                          <div className="text-8xl font-black text-white font-mono tracking-tighter mb-2 tabular-nums">
                            {formatTime(countdown)}
                          </div>
                          <div className="flex items-center space-x-2 bg-black/20 px-4 py-1.5 rounded-full text-white/80 text-xs font-black uppercase tracking-widest">
                            <Activity size={12} className="animate-pulse" /> Dispatching Progress
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white/10 p-8 rounded-[35px] backdrop-blur-md text-white border border-white/20">
                            <p className="text-xs font-black uppercase opacity-60 tracking-widest mb-2">Match Donneurs</p>
                            <div className="flex items-center justify-between">
                               <p className="text-4xl font-black">24</p>
                               <div className="flex -space-x-3">
                                  {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/${i+10}/40/40`} className="w-10 h-10 rounded-full border-2 border-red-600 shadow-md" alt="donor" />)}
                               </div>
                            </div>
                          </div>
                          <div className="bg-white/10 p-8 rounded-[35px] backdrop-blur-md text-white border border-white/20">
                            <p className="text-xs font-black uppercase opacity-60 tracking-widest mb-2">Coursiers Prêts</p>
                            <div className="flex items-center justify-between">
                               <p className="text-4xl font-black">3</p>
                               <Truck size={32} className="opacity-40" />
                            </div>
                          </div>
                          <div className="bg-white/10 p-8 rounded-[35px] backdrop-blur-md text-white border border-white/20">
                            <p className="text-xs font-black uppercase opacity-60 tracking-widest mb-2">Fonds Mobilisés</p>
                            <div className="flex items-center justify-between">
                               <p className="text-2xl font-black">Mobile Money</p>
                               <Smartphone size={32} className="opacity-40" />
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setEmergencyActive(false)}
                          className="text-white/40 hover:text-white text-sm font-black uppercase tracking-widest transition-colors"
                        >
                          Annuler l'intervention
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center">
                        <Smartphone size={24} className="mr-3 text-blue-500" /> Financement Hybride
                      </h4>
                      <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        Le transport et les tests d'urgence sont financés par le fonds "Solidarité MENGA". 
                        Les coursiers reçoivent leur paiement automatiquement dès livraison.
                      </p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between">
                       <div>
                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Solde du Fonds</span>
                         <p className="text-3xl font-black text-blue-700">745.000 <span className="text-sm">FCFA</span></p>
                       </div>
                       <button className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200"><ArrowRight size={24}/></button>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-10 rounded-[40px] shadow-xl text-white">
                    <h4 className="text-xl font-black mb-4 flex items-center text-red-500">
                      <ShieldCheck size={24} className="mr-3" /> Ledger MENGA Safe
                    </h4>
                    <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                      Chaque poche de sang est encryptée et tracée. Impossible de falsifier l'origine ou de détourner une unité.
                    </p>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Synchronisation Blockchain</span>
                          <span className="text-emerald-400 font-black uppercase">En Direct</span>
                       </div>
                       <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 w-3/4 animate-pulse"></div>
                       </div>
                       <div className="flex items-center text-[10px] text-slate-600 font-mono overflow-hidden truncate">
                          TX_ID: 0x4f2a9b12c88de12009abcf...
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'coolers' && renderCoolers()}
          {activeTab === 'traceability' && renderTraceability()}
          {activeTab === 'ai' && renderAi()}
          {activeTab === 'donors' && renderDonors()}
        </div>

        {/* Mobile Nav Overlay */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 h-24 flex items-center justify-around px-4 z-[100] shadow-2xl">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center transition-all ${activeTab === 'dashboard' ? 'text-red-600 scale-110' : 'text-slate-300'}`}>
            <Activity size={26} />
            <span className="text-[9px] mt-1 font-black uppercase tracking-widest">Dash</span>
          </button>
          <button onClick={() => setActiveTab('stock')} className={`flex flex-col items-center transition-all ${activeTab === 'stock' ? 'text-red-600 scale-110' : 'text-slate-300'}`}>
            <Droplets size={26} />
            <span className="text-[9px] mt-1 font-black uppercase tracking-widest">Stock</span>
          </button>
          <button onClick={() => setActiveTab('emergency')} className="flex flex-col items-center -mt-12">
             <div className="w-20 h-20 bg-red-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-red-300 ring-8 ring-white transition-transform active:scale-90">
                <Zap size={32} fill="white" />
             </div>
             <span className="text-[10px] mt-2 font-black text-red-600 tracking-tighter">URGENCE</span>
          </button>
          <button onClick={() => setActiveTab('coolers')} className={`flex flex-col items-center transition-all ${activeTab === 'coolers' ? 'text-red-600 scale-110' : 'text-slate-300'}`}>
            <Sun size={26} />
            <span className="text-[9px] mt-1 font-black uppercase tracking-widest">IoT</span>
          </button>
          <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center transition-all ${activeTab === 'ai' ? 'text-red-600 scale-110' : 'text-slate-300'}`}>
            <BrainCircuit size={26} />
            <span className="text-[9px] mt-1 font-black uppercase tracking-widest">AI</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
