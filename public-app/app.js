// --------------------------------------------------
// UNG REJS – Browser Version uden API-nøgle
// React + Tailwind + Babel i GitHub Pages
// --------------------------------------------------

const { useState } = React;
const ReactMarkdown = window.ReactMarkdown;
const NeonButton = window.NeonButton;

// --------------------------------------------------
// Enums (plain JS)
// --------------------------------------------------

const FeatureType = {
  FLIGHTS: "FLIGHTS",
  HOTELS: "HOTELS",
  PACKING_LIST: "PACKING_LIST",
  PUBLIC_TRANSPORT: "PUBLIC_TRANSPORT",
  EMERGENCY_INFO: "EMERGENCY_INFO",
  PAYMENT_INFO: "PAYMENT_INFO",
  DESTINATION_INFO: "DESTINATION_INFO",
  FOOD_AND_DINING: "FOOD_AND_DINING"
};

const FEATURE_LABELS = {
  [FeatureType.FLIGHTS]: "Fly & Transport",
  [FeatureType.HOTELS]: "Overnatning",
  [FeatureType.PACKING_LIST]: "Pakkelister",
  [FeatureType.PUBLIC_TRANSPORT]: "Offentlig Transport",
  [FeatureType.EMERGENCY_INFO]: "Nødinformation",
  [FeatureType.PAYMENT_INFO]: "Økonomi",
  [FeatureType.DESTINATION_INFO]: "Om Destinationen",
  [FeatureType.FOOD_AND_DINING]: "Mad & Drikke"
};

const FEATURE_ICONS = {
  [FeatureType.FLIGHTS]: "✈️",
  [FeatureType.HOTELS]: "🛏️",
  [FeatureType.PACKING_LIST]: "📋",
  [FeatureType.PUBLIC_TRANSPORT]: "🚌",
  [FeatureType.EMERGENCY_INFO]: "🚨",
  [FeatureType.PAYMENT_INFO]: "💳",
  [FeatureType.DESTINATION_INFO]: "🗺️",
  [FeatureType.FOOD_AND_DINING]: "🍽️"
};

const FEATURE_COLORS = {
  [FeatureType.FLIGHTS]: "text-neon-blue border-neon-blue/30",
  [FeatureType.HOTELS]: "text-neon-purple border-neon-purple/30",
  [FeatureType.PACKING_LIST]: "text-neon-green border-neon-green/30",
  [FeatureType.PUBLIC_TRANSPORT]: "text-yellow-400 border-yellow-400/30",
  [FeatureType.EMERGENCY_INFO]: "text-red-500 border-red-500/30",
  [FeatureType.PAYMENT_INFO]: "text-emerald-400 border-emerald-400/30",
  [FeatureType.DESTINATION_INFO]: "text-orange-400 border-orange-400/30",
  [FeatureType.FOOD_AND_DINING]: "text-pink-500 border-pink-500/30"
};

// --------------------------------------------------
// SUB MENU DATA
// --------------------------------------------------

const SUB_MENUS = {
  [FeatureType.FLIGHTS]: [
    { id: 'cheap_flights', label: 'Billige Billetter', icon: '💸', promptContext: 'Find de billigste flybilletter.' },
    { id: 'best_time', label: 'Bedste Tidspunkt', icon: '📅', promptContext: 'Hvornår er det billigst at flyve?' },
    { id: 'airport_transport', label: 'Fra Lufthavn til Centrum', icon: '🚆', promptContext: 'Transport fra lufthavn til byen.' },
    { id: 'rules', label: 'Bagage Regler', icon: '🧳', promptContext: 'Regler for bagage hos flyselskaber.' }
  ],
  [FeatureType.HOTELS]: [
    { id: 'hostels', label: 'Hostels', icon: '🛏️', promptContext: 'Find de bedste hostels for unge.' },
    { id: 'cheap_hotels', label: 'Billige Hoteller', icon: '🏨', promptContext: 'Gode budgethoteller centralt i byen.' },
    { id: 'areas', label: 'Bedste Områder', icon: '🗺️', promptContext: 'Hvilke bydele er gode og sikre?' },
    { id: 'airbnb', label: 'Airbnb Tips', icon: '🏠', promptContext: 'Hvad skal man vide om Airbnb her?' }
  ],
  [FeatureType.PUBLIC_TRANSPORT]: [
    { id: 'trip_planner', label: 'Rejseplanlægning', icon: '📍', promptContext: 'PLANNER', requiresInput: true },
    { id: 'metro_bus', label: 'Metro & Bus', icon: '🚇', promptContext: 'Guide til offentlig transport.' },
    { id: 'taxi_uber', label: 'Taxi & Uber', icon: '🚕', promptContext: 'Priser og apps til taxi/Uber.' },
    { id: 'bike_walk', label: 'Cykel & Gå', icon: '🚲', promptContext: 'Er byen god at gå/cykle i?' },
    { id: 'night', label: 'Nattransport', icon: '🌙', promptContext: 'Hvordan kommer man hjem om natten?' }
  ],
  [FeatureType.FOOD_AND_DINING]: [
    { id: 'street_food', label: 'Street Food', icon: '🌮', promptContext: 'Bedste street food markeder.' },
    { id: 'restaurants', label: 'Billig Aftensmad', icon: '🍝', promptContext: 'Gode restauranter, unge har råd til.' },
    { id: 'drinks', label: 'Barer & Drinks', icon: '🍹', promptContext: 'Happy Hour? Hvor går man i byen?' },
    { id: 'tipping', label: 'Drikkepenge', icon: '💰', promptContext: 'Giver man drikkepenge her?' }
  ],
  [FeatureType.PACKING_LIST]: [
    { id: 'period_list', label: 'Pakkeliste (periode)', icon: '🎒', promptContext: 'Pakkeliste efter årstid.' },
    { id: 'city', label: 'Storbyferie', icon: '🏙️', promptContext: 'Pakkeliste til storbyferie.' },
    { id: 'winter', label: 'Vinter', icon: '❄️', promptContext: 'Pakkeliste til kulde.' },
    { id: 'festival', label: 'Festival', icon: '🎉', promptContext: 'Pakkeliste til fest og natteliv.' }
  ],
  [FeatureType.EMERGENCY_INFO]: [
    { id: 'numbers', label: 'Nødnumre', icon: '🆘', promptContext: 'Politi, ambulance, brandvæsen.' },
    { id: 'embassy', label: 'Ambassade', icon: '🇩🇰', promptContext: 'Dansk ambassade/konsulat info.' },
    { id: 'lost_card', label: 'Mistet Kort', icon: '💳', promptContext: 'Hvad gør man ved mistet kort?' },
    { id: 'police', label: 'Politi', icon: '👮', promptContext: 'Hvor er politistationen?' }
  ],
  [FeatureType.PAYMENT_INFO]: [
    { id: 'currency', label: 'Valuta', icon: '💱', promptContext: 'Lokal valuta og kurs.' },
    { id: 'cash_card', label: 'Kontant / Kort', icon: '🏧', promptContext: 'Kan man betale med kort?' },
    { id: 'apps', label: 'Betalingsapps', icon: '📱', promptContext: 'Apple Pay / Google Pay? Lokale apps?' },
    { id: 'scams', label: 'Turistfælder', icon: '⚠️', promptContext: 'Typiske scams ved betaling.' }
  ],
  [FeatureType.DESTINATION_INFO]: [
    { id: 'vibe', label: 'Byens Vibe', icon: '✨', promptContext: 'Stemningen i byen.' },
    { id: 'must_see', label: 'Must See', icon: '📸', promptContext: 'De vigtigste seværdigheder.' },
    { id: 'hidden_gems', label: 'Skjulte Perler', icon: '💎', promptContext: 'Lokale hemmelige steder.' },
    { id: 'dos_donts', label: 'Do\'s & Don\'ts', icon: '☝️', promptContext: 'Kulturelle regler.' }
  ]
};

// --------------------------------------------------
// FAKE "AI" (uden API-nøgle)
// --------------------------------------------------

async function fakeAI(destination, feature, sub, start, end) {
  return {
    markdown: `
### 🤖 Demo-svar – ingen API-nøgle

**Destination:** ${destination}
**Kategori:** ${FEATURE_LABELS[feature]}
**Emne:** ${sub.label}

Dette er et *demo-svar*, så du kan teste appens design uden API.

Fra: ${start || "-"}  
Til: ${end || "-"}  

Når du er klar, kan du tilføje en rigtig Google Gemini API-nøgle.
    `,
    type: "markdown"
  };
}

// --------------------------------------------------
// HOVED-APP
// --------------------------------------------------

function App() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSet, setIsSet] = useState(false);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // Første side: indtast destination
  if (!isSet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg p-6">
        <div className="bg-dark-card border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">UNG REJS</h1>

          <label className="block text-sm mb-2">Destination</label>
          <input
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="F.eks. Barcelona"
            className="w-full p-4 rounded-xl bg-black/40 border border-white/20 text-white mb-4"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Ankomst</label>
              <input type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Hjemrejse</label>
              <input type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white"
              />
            </div>
          </div>

          <button
            onClick={() => setIsSet(true)}
            disabled={!destination.trim()}
            className="mt-6 w-full bg-gradient-to-r from-neon-purple to-neon-pink py-4 rounded-xl font-bold disabled:opacity-50"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-10">
        <div className="text-5xl animate-spin mb-4">🌀</div>
        <p className="text-lg opacity-70">Henter info...</p>
      </div>
    );
  }

  // Viser AI/demosvar
  if (data) {
    return (
      <div className="min-h-screen bg-dark-bg text-white p-6">
        <button onClick={() => { setData(null); setSelectedSub(null); }} className="mb-4 bg-white/10 px-4 py-2 rounded-xl">
          ⬅ Tilbage
        </button>

        <h2 className="text-2xl font-bold mb-4">{selectedSub.label}</h2>

        <div className="bg-dark-card rounded-3xl p-6 border border-white/10">
          <ReactMarkdown>{data.markdown}</ReactMarkdown>
        </div>
      </div>
    );
  }

  // Submenu
  if (selectedFeature && !selectedSub) {
    return (
      <div className="min-h-screen bg-dark-bg text-white p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => setSelectedFeature(null)} className="mb-4 bg-white/10 px-4 py-2 rounded-xl col-span-full">
          ⬅ Tilbage
        </button>

        {SUB_MENUS[selectedFeature].map(sub => (
          <NeonButton
            key={sub.id}
            label={sub.label}
            icon={<span className="text-3xl">{sub.icon}</span>}
            onClick={async () => {
              setSelectedSub(sub);
              setLoading(true);
              const result = await fakeAI(destination, selectedFeature, sub, startDate, endDate);
              setData(result);
              setLoading(false);
            }}
            colorClass={FEATURE_COLORS[selectedFeature]}
          />
        ))}
      </div>
    );
  }

  // Hovedmenu
  return (
    <div className="min-h-screen bg-dark-bg text-white p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      <button onClick={() => setIsSet(false)} className="col-span-full bg-white/10 px-4 py-2 rounded-xl mb-2">
        ⬅ Skift Destination
      </button>

      {Object.values(FeatureType).map(ft => (
        <NeonButton
          key={ft}
          label={FEATURE_LABELS[ft]}
          icon={<span className="text-4xl">{FEATURE_ICONS[ft]}</span>}
          onClick={() => setSelectedFeature(ft)}
          colorClass={FEATURE_COLORS[ft]}
        />
      ))}
    </div>
  );
}

// Gør App global
window.App = App;
