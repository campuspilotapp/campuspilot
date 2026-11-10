/** Existing design tokens live in src/index.css; Tailwind utilities are available alongside them. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: { extend: { colors: { brand: '#5B3DF5', accent: '#FF6B4A' }, fontFamily: { sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'] } } },
  plugins: [],
};
