const { useState } = React;
const ReactMarkdown = window.reactMarkdown || window.ReactMarkdown;
const NeonButton = window.NeonButton;

// --------------------------------------------------
// FeatureType enum som plain JS
// --------------------------------------------------
const FeatureType = {
  FLIGHTS: "FLIGHTS",
  HOTELS: "HOTELS",
  PACKING_LIST: "PACKING_LIST",
  PUBLIC_TRANSPORT: "PUBLIC_TRANSPORT",
  EMERGENCY_INFO: "EMERGENCY_INFO",
  PAYMENT_INFO: "PAYMENT_INFO",
  DESTINATION_INFO: "DESTINATION_INFO",
  FOOD_AND_DINING: "FOOD_AND_DINING",
};

// --------------------------------------------------
// Submenus (samme struktur som din TS-version)
// --------------------------------------------------
const SUB_MENUS = {
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

// Icons til hovedmenu – vi bruger bare emojis
const FEATURE_ICONS = {
  [FeatureType.FLIGHTS]: "✈️",
  [FeatureType.HOTELS]: "🛏️",
  [FeatureType.PACKING_LIST]: "📋",
  [FeatureType.PUBLIC_TRANSPORT]: "🚌",
  [FeatureType.EMERGENCY_INFO]: "🚨",
  [FeatureType.PAYMENT_INFO]: "💳",
  [FeatureType.DESTINATION_INFO]: "🗺️",
  [FeatureType.FOOD_AND_DINING]: "🍽️",
};

// Labels for Main Menu Headers
const FEATURE_LABELS = {
  [FeatureType.FLIGHTS]: "Fly & Transport",
  [FeatureType.HOTELS]: "Overnatning",
  [FeatureType.PACKING_LIST]: "Pakkelister",
  [FeatureType.PUBLIC_TRANSPORT]: "Offentlig Transport",
  [FeatureType.EMERGENCY_INFO]: "Nødinformation",
  [FeatureType.PAYMENT_INFO]: "Økonomi",
  [FeatureType.DESTINATION_INFO]: "Om Destinationen",
  [FeatureType.FOOD_AND_DINING]: "Mad & Drikke",
};

// Farver (tailwind-klasser)
const FEATURE_COLORS = {
  [FeatureType.FLIGHTS]: "text-neon-blue border-neon-blue/30",
  [FeatureType.HOTELS]: "text-neon-purple border-neon-purple/30",
  [FeatureType.PACKING_LIST]: "text-neon-green border-neon-green/30",
  [FeatureType.PUBLIC_TRANSPORT]: "text-yellow-400 border-yellow-400/30",
  [FeatureType.EMERGENCY_INFO]: "text-red-500 border-red-500/30",
  [FeatureType.PAYMENT_INFO]: "text-emerald-400 border-emerald-400/30",
  [FeatureType.DESTINATION_INFO]: "text-orange-400 border-orange-400/30",
  [FeatureType.FOOD_AND_DINING]: "text-pink-500 border-pink-500/30",
};

// Dummy "AI" – demo-svar uden API
async function fetchTravelData(destination, feature, promptContext, startDate, endDate) {
  const md = `
### Demo-svar – ${destination}

*Kategori:* **${FEATURE_LABELS[feature]}**  
*Emne:* **${promptContext}**

Her ville der normalt komme et rigtigt AI-svar fra Gemini.

Indtil du har en API-nøgle, får du et demo-svar, så du kan teste appen og designet.

- Destination: **${destination || "ikke angivet"}**
- Fra: ${startDate || "-"}
- Til: ${endDate || "-"}
`;
  return {
    type: "markdown",
    markdown: md,
    packingList: null,
    groundingUrls: []
  };
}

function App() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDestinationSet, setIsDestinationSet] = useState(false);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedSubFeature, setSelectedSubFeature] = useState(null);

  const [showTripPlannerInput, setShowTripPlannerInput] = useState(false);
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripTime, setTripTime] = useState('');
  const [tripTimeType, setTripTimeType] = useState('departure');

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [checkedItems, setCheckedItems] = useState(new Set());

  const handleSetDestination = (e) => {
    e.preventDefault();
    if (destination.trim()) setIsDestinationSet(true);
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setSelectedSubFeature(null);
    setData(null);
    setShowTripPlannerInput(false);
  };

  const handleSubFeatureClick = async (subFeature) => {
    if (!selectedFeature) return;

    setSelectedSubFeature(subFeature);
    setData(null);
    setCheckedItems(new Set());
    
    if (subFeature.requiresInput && subFeature.id === 'trip_planner') {
      setShowTripPlannerInput(true);
      if (!tripTo) setTripTo(destination);
      return;
    }

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

  const handleTripPlanSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFeature || !selectedSubFeature) return;

    setShowTripPlannerInput(false);
    setLoading(true);

    const prompt = `Rejseplanlægning i ${destination}. Jeg skal fra "${tripFrom}" til "${tripTo}". 
${tripTimeType === 'departure' ? 'Afgang' : 'Ankomst'}: ${tripTime}.`;

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

  const handleBack = () => {
    if (data) {
      setData(null);
      if (selectedSubFeature && selectedSubFeature.id === 'trip_planner') {
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
    return `Henter demo-info om ${selectedSubFeature.label} i ${destination || "din destination"}...`;
  };

  // Første skærm – vælg destination
  if (!isDestinationSet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg text-white relative overflow-hidden">
        <div className="max-w-md w-full bg-dark-card border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <span className="text-5xl animate-bounce">🌍</span>
            </div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple tracking-tighter">
              UNG REJS
            </h1>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Din ultimative ungdoms-rejseguide</p>
          </div>

          <form onSubmit={handleSetDestination} className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 ml-1">Hvor skal du hen?</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="F.eks. Berlin, Paris, Tokyo"
                className="w-full bg-black/40 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2 ml-1">Ankomst</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-3 text-white text-sm focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2 ml-1">Hjemrejse</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-3 text-white text-sm focus:outline-none focus:border-neon-blue transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!destination.trim()}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(191,0,255,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              Start eventyret
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Hovedlayout
  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
        <button onClick={handleBack} className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm">
          ⬅ Tilbage
        </button>
        <div className="text-right">
          <div className="font-bold">{destination}</div>
          {(startDate || endDate) && (
            <div className="text-xs text-gray-400">{startDate || "?"} – {endDate || "?"}</div>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-5xl">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin text-4xl">🌀</div>
            <p className="mt-6 text-lg text-gray-300 text-center">
              {getLoadingText()}
            </p>
          </div>
        )}

        {/* Data visning */}
        {!loading && data && (
          <div className="bg-dark-card border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSubFeature ? selectedSubFeature.label : "Resultat"}
            </h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{data.markdown || ""}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Submenu */}
        {!loading && !data && selectedFeature && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUB_MENUS[selectedFeature].map((sub) => (
              <NeonButton
                key={sub.id}
                label={sub.label}
                icon={<span className="text-3xl">{sub.icon}</span>}
                onClick={() => handleSubFeatureClick(sub)}
                colorClass={FEATURE_COLORS[selectedFeature]}
                subText={sub.id === 'trip_planner' ? 'Find rute A → B' : ''}
              />
            ))}
          </div>
        )}

        {/* Hovedmenu */}
        {!loading && !data && !selectedFeature && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.values(FeatureType).map((feature) => (
              <NeonButton
                key={feature}
                label={FEATURE_LABELS[feature]}
                icon={<span className="text-3xl">{FEATURE_ICONS[feature]}</span>}
                onClick={() => handleFeatureClick(feature)}
                colorClass={FEATURE_COLORS[feature]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Gør App global, så main.js kan se den
window.App = App;
