// NeonButton.js – browser version of your original TSX component

function NeonButton(props) {
  const { label, icon, onClick, colorClass, subText } = props;

  return React.createElement(
    "button",
    {
      onClick,
      className: `
        relative group overflow-hidden p-5 rounded-2xl 
        bg-dark-card border border-white/10
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        flex flex-col items-center justify-center gap-3
        text-center shadow-lg w-full h-full min-h-[140px]
        ${colorClass}
      `
    },

    // Background glow effect
    React.createElement("div", {
      className:
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-current blur-2xl"
    }),

    // Icon
    React.createElement(
      "div",
      {
        className:
          "text-4xl z-10 transition-transform group-hover:-translate-y-1 duration-300 drop-shadow-md"
      },
      icon
    ),

    // Label + subtext
    React.createElement(
      "div",
      { className: "z-10 flex flex-col gap-1" },

      React.createElement(
        "span",
        {
          className:
            "text-sm md:text-base font-black tracking-wider uppercase text-white group-hover:text-shadow-neon leading-tight"
        },
        label
      ),

      subText
        ? React.createElement(
            "span",
            {
              className:
                "text-[10px] md:text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            },
            subText
          )
        : null
    ),

    // Bottom light bar
    React.createElement("div", {
      className:
        "absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 group-hover:opacity-100 transition-opacity"
    })
  );
}

// Export to global namespace
window.NeonButton = NeonButton;
