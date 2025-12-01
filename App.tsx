import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Plane,
  BedDouble,
  ClipboardList,
  Bus,
  Siren,
  CreditCard,
  MapPin,
  Utensils,
  ArrowLeft,
  Search,
  Loader2,
  Globe,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  Home,
  Calendar,
  CalendarDays,
  Clock,
  Map
} from 'lucide-react';
import { FeatureType, TravelResponse, SubFeature } from './types';
import { fetchTravelData } from './services/geminiService';
import NeonButton from './components/NeonButton';

// --- CONFIGURATION: Sub Menus ---
const SUB_MENUS: Record<FeatureType, SubFeature[]> = {
  [FeatureType.FLIGHTS]: [
    { id: 'cheap_flights', label: 'Billige Billetter', icon: '💸', promptContext: 'Find de billigste flybilletter, inkluder prissammenligningssider og lavprisselskaber.' },
    { id: 'best_time', label: 'Bedste Tidspunkt', icon: '📅', promptContext: 'Hvornår er det billigst at flyve? Hvornår skal man bestille?' },
    { id: 'airport_transport', label: 'Fra Lufthavn til By', icon: '🚆', promptContext: 'Hvordan kommer man nemmest og billigst fra lufthavnen til centrum? Priser på tog, bus, taxi.' },
    { id: 'rules', label: 'Bagage & Regler', icon: '🧳', promptContext: 'Generelle regler for håndbagage og tips til at undgå gebyrer hos lavprisselskaber.' }
  ],
  [FeatureType.HOTELS]: [
    { id: 'hostels', label: 'Fede Hostels', icon: '🛏️', promptContext: 'Find de bedste og mest sociale hostels for unge. Hvor møder man andre?' },
    { id: 'cheap_hotels', label: 'Budget Hoteller', icon: '🏨', promptContext: 'Gode, billige hoteller (2-3 stjerner) der ligger centralt.' },
    { id: 'areas', label: 'Hvor skal man bo?', icon: '🗺️', promptContext: 'Hvilke bydele er bedst for unge? Hvor er nattelivet? Hvilke områder skal man undgå?' },
    { id: 'airbnb', label: 'Airbnb Tips', icon: '🏠', promptContext: 'Er Airbnb populært her? Hvad skal man være opmærksom på?' }
  ],
  [FeatureType.PUBLIC_TRANSPORT]: [
    { id: 'trip_planner', label: 'Rejseplanlægger', icon: '📍', promptContext: 'PLANNER', requiresInput: true },
    { id: 'metro_bus', label: 'Metro & Bus', icon: '🚇', promptContext: 'Guide til offentlig transport. Billetpriser, kort, apps man skal hente.' },
    { id: 'taxi_uber', label: 'Taxi & Apps', icon: '🚕', promptContext: 'Findes Uber/Bolt/Grab her? Hvad koster en taxi? Er det sikkert?' },
    { id: 'bike_walk', label: 'Cykel & Gåben', icon: '🚲', promptContext: 'Er byen cykelvenlig? Kan man leje cykler/el-løbehjul? Er det nemt at gå rundt?' },
    { id: 'night', label: 'Transport om Natten', icon: '🌙', promptContext: 'Hvordan kommer man hjem fra byen om natten? Kører busserne?' }
  ],
  [FeatureType.FOOD_AND_DINING]: [
    { id: 'street_food', label: 'Street Food', icon: '🌮', promptContext: 'Bedste street food markeder og billige snacks man skal prøve.' },
    { id: 'restaurants', label: 'Billig Aftensmad', icon: '🍝', promptContext: 'Gode restauranter der er til at betale for unge. Lokale favoritter.' },
    { id: 'drinks', label: 'Barer & Drinks', icon: '🍹', promptContext: 'Hvor er happy hour? Gode områder at gå i byen.' },
    { id: 'tipping', label: 'Drikkepenge', icon: '💰', promptContext: 'Giver man drikkepenge her? Hvor meget er normalt?' }
  ],
  [FeatureType.PACKING_LIST]: [
    { id: 'period_list', label: 'Pakkeliste til Perioden', icon: '🎒', promptContext: 'komplet pakkeliste der passer perfekt til årstiden og vejret i den valgte rejseperiode' },
    { id: 'city', label: 'Storbyferie', icon: '🏙️', promptContext: 'komplet pakkeliste til storbyferie (meget gågang)' },
    { id: 'winter', label: 'Vinter/Ski', icon: '❄️', promptContext: 'komplet pakkeliste til koldt vejr/vinter' },
    { id: 'festival', label: 'Festival/Fest', icon: '🎉', promptContext: 'komplet pakkeliste til en ferie med fokus på fest og natteliv' }
  ],
  [FeatureType.EMERGENCY_INFO]: [
    { id: 'numbers', label: 'Nødnumre', icon: '🆘', promptContext: 'Telefonnumre til politi, ambulance og brandvæsen.' },
    { id: 'embassy', label: 'Ambassaden', icon: '🇩🇰', promptContext: 'Adresse og kontaktinfo til den Danske Ambassade eller konsulat.' },
    { id: 'lost_card', label: 'Mistet Kort', icon: '💳', promptContext: 'Numre til at spærre danske kreditkort (Nets osv.) og hvad man gør.' },
    { id: 'police', label: 'Politi & Tyveri', icon: '👮', promptContext: 'Hvad gør man hvis man får stjålet noget? Hvor ligger nærmeste politistation?' }
  ],
  [FeatureType.PAYMENT_INFO]: [
    { id: 'currency', label: 'Valuta & Kurs', icon: '💱', promptContext: 'Hvad er valutaen? Hvad svarer 100 DKK til cirka? Er det billigt eller dyrt?' },
    { id: 'cash_card', label: 'Kort vs Kontant', icon: '🏧', promptContext: 'Kan man bruge kort overalt? Skal man have kontanter? Hævegebyrer?' },
    { id: 'apps', label: 'Betalings Apps', icon: '📱', promptContext: 'Virker Apple Pay/Google Pay? Har de lokale apps som MobilePay?' },
    { id: 'scams', label: 'Turistfælder', icon: '⚠️', promptContext: 'Kendte scams når man veksler penge eller betaler? Hvad skal man undgå?' }
  ],
  [FeatureType.DESTINATION_INFO]: [
    { id: 'vibe', label: 'Vibe Check', icon: '✨', promptContext: 'Beskriv stemningen i byen. Er det chill, hektisk, festligt? Hvem rejser hertil?' },
    { id: 'must_see', label: 'Must See', icon: '📸', promptContext: 'De 3-5 vigtigste seværdigheder man SKAL se.' },
    { id: 'hidden_gems', label: 'Hidden Gems', icon: '💎', promptContext: 'Steder hvor de lokale kommer, som turisterne overser.' },
    { id: 'dos_donts', label: 'Do\'s & Don\'ts', icon: '☝️', promptContext: 'Kulturelle regler. Hvad må man absolut ikke gøre? Hvad er høfligt?' }
  ]
};

// Icons mapping for Main Menu
const FEATURE_ICONS: Record<FeatureType, React.ReactNode> = {
  [FeatureType.FLIGHTS]: <Plane />,
  [FeatureType.HOTELS]: <BedDouble />,
  [FeatureType.PACKING_LIST]: <ClipboardList />,
  [FeatureType.PUBLIC_TRANSPORT]: <Bus />,
  [FeatureType.EMERGENCY_INFO]: <Siren />,
  [FeatureType.PAYMENT_INFO]: <CreditCard />,
  [FeatureType.DESTINATION_INFO]: <MapPin />,
  [FeatureType.FOOD_AND_DINING]: <Utensils />,
};

// Colors for Main Menu
const FEATURE_COLORS: Record<FeatureType, string> = {
  [FeatureType.FLIGHTS]: "text-neon-blue hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] border-neon-blue/30",
  [FeatureType.HOTELS]: "text-neon-purple hover:shadow-[0_0_30px_rgba(191,0,255,0.4)] border-neon-purple/30",
  [FeatureType.PACKING_LIST]: "text-neon-green hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] border-neon-green/30",
  [FeatureType.PUBLIC_TRANSPORT]: "text-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] border-yellow-400/30",
  [FeatureType.EMERGENCY_INFO]: "text-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] border-red-500/30",
  [FeatureType.PAYMENT_INFO]: "text-emerald-400 hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] border-emerald-400/30",
  [FeatureType.DESTINATION_INFO]: "text-orange-400 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] border-orange-400/30",
  [FeatureType.FOOD_AND_DINING]: "text-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] border-pink-500/30",
};

// Labels for Main Menu Headers
const FEATURE_LABELS: Record<FeatureType, string> = {
  [FeatureType.FLIGHTS]: "Fly & Transport",
  [FeatureType.HOTELS]: "Overnatning",
  [FeatureType.PACKING_LIST]: "Pakkelister",
  [FeatureType.PUBLIC_TRANSPORT]: "Offentlig Transport",
  [FeatureType.EMERGENCY_INFO]: "Nødinformation",
  [FeatureType.PAYMENT_INFO]: "Økonomi",
  [FeatureType.DESTINATION_INFO]: "Om Destinationen",
  [FeatureType.FOOD_AND_DINING]: "Mad & Drikke",
};

const App: React.FC = () => {
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isDestinationSet, setIsDestinationSet] = useState<boolean>(false);
  
  // Navigation State
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>(null);
  const [selectedSubFeature, setSelectedSubFeature] = useState<SubFeature | null>(null);
  
  // Trip Planner State
  const [showTripPlannerInput, setShowTripPlannerInput] = useState<boolean>(false);
  const [tripFrom, setTripFrom] = useState<string>('');
  const [tripTo, setTripTo] = useState<string>('');
  const [tripTime, setTripTime] = useState<string>('');
  const [tripTimeType, setTripTimeType] = useState<'departure' | 'arrival'>('departure');

  // Data State
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TravelResponse | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleSetDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      setIsDestinationSet(true);
    }
  };

  const handleFeatureClick = (feature: FeatureType) => {
    setSelectedFeature(feature);
    setSelectedSubFeature(null);
    setData(null);
    setShowTripPlannerInput(false);
  };

  const handleSubFeatureClick = async (subFeature: SubFeature) => {
    if (!selectedFeature) return;

    setSelectedSubFeature(subFeature);
    setData(null);
    setCheckedItems(new Set()); // Reset checked items for packing list
    
    // Check if this feature requires custom input (like Trip Planner)
    if (subFeature.requiresInput) {
      if (subFeature.id === 'trip_planner') {
        setShowTripPlannerInput(true);
        // Pre-fill "To" with destination if empty
        if (!tripTo) setTripTo(destination);
      }
      return; 
    }

    // Standard flow
    setLoading(true);
    const response = await fetchTravelData(
      destination, 
      selectedFeature, 
      subFeature.promptContext,
      startDate,
      endDate
    );
    
    setData(response);
    setLoading(false);
  };

  const handleTripPlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeature || !selectedSubFeature) return;

    setShowTripPlannerInput(false);
    setLoading(true);

    const prompt = `Rejseplanlægning i ${destination}. Jeg skal fra "${tripFrom}" til "${tripTo}". 
    ${tripTimeType === 'departure' ? 'Afgang' : 'Ankomst'}: ${tripTime}.
    Find den bedste rute med offentlig transport. Inkluder transportmidler (bus, tog, metro), estimeret pris, og rejsetid. 
    Hvis muligt, giv links til lokale rejseplanlæggere eller Google Maps.`;

    const response = await fetchTravelData(
      destination,
      selectedFeature,
      prompt,
      startDate,
      endDate
    );

    setData(response);
    setLoading(false);
  };

  const togglePackingItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const handleBack = () => {
    if (data) {
      setData(null);
      // If we were in trip planner results, go back to form
      if (selectedSubFeature?.id === 'trip_planner') {
        setShowTripPlannerInput(true);
      }
      return;
    }
    
    if (showTripPlannerInput) {
      setShowTripPlannerInput(false);
      setSelectedSubFeature(null);
      return;
    }
    
    if (selectedFeature) {
      setSelectedFeature(null);
      setSelectedSubFeature(null);
      return;
    }
    
    setIsDestinationSet(false);
  };

  const getLoadingText = () => {
    if (!selectedSubFeature) return 'Arbejder på det...';
    
    switch (selectedSubFeature.id) {
      case 'cheap_flights': return `Scanner nettet for billige billetter til ${destination}...`;
      case 'trip_planner': return `Beregner bedste rute i ${destination}...`;
      case 'hostels': return `Finder de fedeste hostels i ${destination}...`;
      case 'street_food': return `Sniffer mig frem til den bedste mad i ${destination}...`;
      case 'period_list': return `Tjekker vejrudsigten og pakker kufferten for dig...`;
      default: return `Henter info om ${selectedSubFeature.label}...`;
    }
  };

  // --- RENDERING ---

  if (!isDestinationSet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg text-white relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple rounded-full blur-[150px] opacity-20 animate-pulse-fast"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue rounded-full blur-[150px] opacity-20 animate-pulse-fast" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-md w-full bg-dark-card border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Globe className="w-16 h-16 text-neon-blue animate-pulse" />
            </div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple tracking-tighter">
              UNG REJS
            </h1>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Din ultimative guide</p>
          </div>

          <form onSubmit={handleSetDestination} className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 ml-1">Hvor skal du hen?</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-pink w-5 h-5" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="F.eks. Berlin, Paris, Tokyo"
                  className="w-full bg-black/40 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2 ml-1">Ankomst</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue w-4 h-4" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-2 text-white text-sm focus:outline-none focus:border-neon-blue transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2 ml-1">Hjemrejse</label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue w-4 h-4" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-2 text-white text-sm focus:outline-none focus:border-neon-blue transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!destination.trim()}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(191,0,255,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Start Eventyret <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 overflow-hidden">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {selectedFeature ? <ArrowLeft className="w-6 h-6 text-neon-blue" /> : <Home className="w-6 h-6 text-neon-blue" />}
          </button>
          
          <div className="flex flex-col overflow-hidden">
            <h2 className="font-bold text-lg truncate flex items-center gap-2">
              <span className="text-neon-pink uppercase tracking-wider">{destination}</span>
              {selectedFeature && (
                <>
                  <span className="text-gray-600">/</span>
                  <span className="text-white truncate">{FEATURE_LABELS[selectedFeature]}</span>
                </>
              )}
            </h2>
            {startDate && endDate && (
              <span className="text-[10px] text-gray-400 font-mono tracking-tight flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {startDate} - {endDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        
        {/* VIEW: Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-blue blur-xl opacity-20 animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-neon-blue animate-spin relative z-10" />
            </div>
            <p className="mt-8 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse text-center px-4">
              {getLoadingText()}
            </p>
          </div>
        )}

        {/* VIEW: Trip Planner Input Form */}
        {!loading && showTripPlannerInput && (
          <div className="max-w-md mx-auto animate-fade-in">
             <div className="bg-dark-card border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-blue"></div>
                
                <h3 className="text-2xl font-black text-center mb-6 flex items-center justify-center gap-2">
                  <Map className="text-neon-blue" /> Rejseplanlægger
                </h3>

                <form onSubmit={handleTripPlanSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs uppercase font-bold text-gray-500 ml-1 block mb-1">Fra</label>
                    <input 
                      type="text" 
                      value={tripFrom} 
                      onChange={(e) => setTripFrom(e.target.value)} 
                      placeholder="Din placering / adresse"
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-center -my-2 relative z-10">
                     <div className="bg-dark-card border border-white/10 p-2 rounded-full">
                       <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                     </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase font-bold text-gray-500 ml-1 block mb-1">Til</label>
                    <input 
                      type="text" 
                      value={tripTo} 
                      onChange={(e) => setTripTo(e.target.value)} 
                      placeholder={destination}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-neon-purple focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs uppercase font-bold text-gray-500 ml-1 block mb-1">Tidspunkt</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="time" 
                          value={tripTime} 
                          onChange={(e) => setTripTime(e.target.value)} 
                          className="w-full bg-black/40 border border-white/20 rounded-xl p-3 pl-10 text-white focus:border-neon-green focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-end">
                       <div className="flex bg-black/40 border border-white/20 rounded-xl p-1">
                         <button 
                           type="button"
                           onClick={() => setTripTimeType('departure')}
                           className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tripTimeType === 'departure' ? 'bg-neon-blue text-black' : 'text-gray-400 hover:text-white'}`}
                         >
                           Afgang
                         </button>
                         <button 
                           type="button"
                           onClick={() => setTripTimeType('arrival')}
                           className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tripTimeType === 'arrival' ? 'bg-neon-purple text-white' : 'text-gray-400 hover:text-white'}`}
                         >
                           Ankomst
                         </button>
                       </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-neon-blue to-neon-green text-black font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider mt-4"
                  >
                    Find Rute
                  </button>
                </form>
             </div>
          </div>
        )}

        {/* VIEW: Data Display */}
        {!loading && !showTripPlannerInput && data && (
          <div className="animate-fade-in">
            {/* Header for Result */}
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-3xl">{selectedSubFeature?.icon}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{selectedSubFeature?.label}</h3>
                <p className="text-sm text-gray-400">
                  {selectedSubFeature?.id === 'trip_planner' ? `Fra ${tripFrom} til ${tripTo}` : `Guide til ${destination}`}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="bg-dark-card border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
              {/* Top decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple blur-[80px] opacity-10 pointer-events-none"></div>

              {data.type === 'packing_list' && data.packingList ? (
                // Packing List View
                <div className="space-y-8">
                  {data.packingList.map((category, idx) => (
                    <div key={idx} className="bg-black/20 rounded-2xl p-5 border border-white/5">
                      <h4 className="text-lg font-bold text-neon-blue mb-4 uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> {category.name}
                      </h4>
                      <div className="space-y-3">
                        {category.items.map((item, itemIdx) => {
                          const isChecked = checkedItems.has(item);
                          return (
                            <div 
                              key={itemIdx} 
                              onClick={() => togglePackingItem(item)}
                              className={`
                                flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                                ${isChecked ? 'bg-neon-green/10 text-gray-400' : 'bg-white/5 hover:bg-white/10'}
                              `}
                            >
                              {isChecked ? (
                                <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              )}
                              <span className={`${isChecked ? 'line-through decoration-neon-green/50' : ''}`}>
                                {item}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center pt-4">
                    <p className="text-gray-500 text-sm italic">
                      {Math.round((checkedItems.size / data.packingList.reduce((acc, cat) => acc + cat.items.length, 0)) * 100)}% pakket
                    </p>
                  </div>
                </div>
              ) : (
                // Markdown View
                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-neon-blue prose-a:text-neon-pink prose-strong:text-white">
                  <ReactMarkdown>{data.markdown || ''}</ReactMarkdown>
                </div>
              )}

              {/* Grounding Sources */}
              {data.groundingUrls && data.groundingUrls.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4" /> Kilder & Links
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.groundingUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-white/5 hover:bg-neon-blue/20 hover:text-neon-blue border border-white/10 rounded-full px-3 py-1 transition-colors truncate max-w-[200px]"
                      >
                        {url.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Sub Menu Grid */}
        {!loading && !data && !showTripPlannerInput && selectedFeature && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 animate-fade-in">
            {SUB_MENUS[selectedFeature]?.map((sub) => (
              <NeonButton
                key={sub.id}
                label={sub.label}
                icon={<span className="text-3xl">{sub.icon}</span>}
                onClick={() => handleSubFeatureClick(sub)}
                colorClass={FEATURE_COLORS[selectedFeature]}
                subText={sub.id === 'trip_planner' ? 'Find rute A til B' : ''}
              />
            ))}
          </div>
        )}

        {/* VIEW: Main Menu Grid */}
        {!loading && !data && !selectedFeature && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
            {Object.values(FeatureType).map((feature) => (
              <NeonButton
                key={feature}
                label={FEATURE_LABELS[feature]}
                icon={FEATURE_ICONS[feature]}
                onClick={() => handleFeatureClick(feature)}
                colorClass={FEATURE_COLORS[feature]}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default App;