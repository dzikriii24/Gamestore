/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'steam-dark': '#0b141d',
        'steam-darker': '#0a0f14',
        'steam-panel': '#0f1a24',
        'steam-mid': '#16202d',
        'steam-blue': '#1b2838',
        'steam-accent': '#66c0f4',
        'steam-green': '#a4d007'
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'steam-card': '0 20px 40px rgba(0, 0, 0, 0.35)',
        'steam-glow': '0 15px 50px rgba(102, 192, 244, 0.25)'
      },
      backgroundImage: {
        'steam-grid':
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
        'steam-radial':
          'radial-gradient(circle at 20% 20%, rgba(102,192,244,0.15), transparent 25%), radial-gradient(circle at 80% 0%, rgba(164,208,7,0.12), transparent 20%), linear-gradient(180deg, #0a1018 0%, #0b141d 50%, #0a0f14 100%)'
      }
    }
  },
  plugins: []
};
