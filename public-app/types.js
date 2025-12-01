// ------------------------------
// FeatureType enum
// ------------------------------
export const FeatureType = {
  FLIGHTS: "FLIGHTS",
  HOTELS: "HOTELS",
  PACKING_LIST: "PACKING_LIST",
  PUBLIC_TRANSPORT: "PUBLIC_TRANSPORT",
  EMERGENCY_INFO: "EMERGENCY_INFO",
  PAYMENT_INFO: "PAYMENT_INFO",
  DESTINATION_INFO: "DESTINATION_INFO",
  FOOD_AND_DINING: "FOOD_AND_DINING"
};

// ------------------------------
// TravelResponse (JS version)
// ------------------------------
export function createTravelResponse(data) {
  return {
    markdown: data.markdown || "",
    type: data.type || "markdown",
    packingList: data.packingList || null,
    groundingUrls: data.groundingUrls || []
  };
}

// ------------------------------
// SubFeature type in JS form
// ------------------------------
export function createSubFeature(obj) {
  return {
    id: obj.id,
    label: obj.label,
    icon: obj.icon,
    promptContext: obj.promptContext,
    requiresInput: obj.requiresInput || false
  };
}
