export const getPreferredScheme = () => window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
