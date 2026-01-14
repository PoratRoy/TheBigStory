export const CATEGORY_COLORS = [
  // Red
  '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  // Orange
  '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
  // Amber
  '#d97706', '#b45309', '#92400e', '#78350f',
  // Yellow
  '#ca8a04', '#a16207', '#854d0e', '#713f12',
  // Lime
  '#65a30d', '#4d7c0f', '#3f6212', '#365314',
  // Green
  '#16a34a', '#15803d', '#166534', '#14532d',
  // Emerald
  '#059669', '#047857', '#065f46', '#064e3b',
  // Teal
  '#0d9488', '#0f766e', '#115e59', '#134e4a',
  // Cyan
  '#0891b2', '#0e7490', '#155e75', '#164e63',
  // Sky
  '#0284c7', '#0369a1', '#075985', '#0c4a6e',
  // Blue
  '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
  // Indigo
  '#4f46e5', '#4338ca', '#3730a3', '#312e81',
  // Violet
  '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
  // Purple
  '#9333ea', '#7e22ce', '#6b21a8', '#581c87',
  // Fuchsia
  '#c026d3', '#a21caf', '#86198f', '#701a75',
  // Pink
  '#db2777', '#be185d', '#9d174d', '#831843',
  // Rose
  '#e11d48', '#be123c', '#9f1239', '#881337',
  // Slate/Gray Dark
  '#334155', '#1e293b', '#0f172a', '#475569',
  // Zinc/Neutral Dark
  '#3f3f46', '#27272a', '#18181b', '#52525b',
  // Deep Earthy
  '#422006', '#452205', '#2d0f02', '#3e1d1d',
  // Deep Ocean
  '#020617', '#082f49', '#111827', '#022c22',
  // Deep Forest
  '#052e16',
  // Deep Royal
  '#1e1b4b', '#2e1065', '#3b0764', '#4c0519',
  // Deep Maroon & Burgundy
  '#450a0a', '#4c0505', '#630606', '#540b0b',
  // Deep Olive & Moss
  '#1a2e05', '#242c16', '#1c1917',
  // Deep Navy & Charcoal
  '#171717',
  // Deep Plum & Eggplant
  '#300720', '#4a044e',
  // Deep Vibrant Dark
  '#500724',
  // Added unique tones
  '#083344', '#155e75', '#164e63', '#0e7490',
  '#1e1b4b', '#312e81', '#3730a3', '#4338ca',
  '#2e1065', '#4c1d95', '#5b21b6', '#6d28d9',
  '#4c0519', '#831843', '#9d174d', '#be185d',
  '#500724', '#881337', '#9f1239', '#be123c',
  '#310a0a', '#450a0a', '#7f1d1d', '#991b1b',
  '#300720', '#4d072b', '#701a75', '#86198f',
  '#052e16', '#064e3b', '#065f46', '#0f766e',
  '#1a2e05', '#365314', '#3f6212', '#4d7c0f',
  '#2d2006', '#422006', '#713f12', '#854d0e',
];

export const getRandomColor = (excludeColors: string[] = []) => {
  const availableColors = CATEGORY_COLORS.filter(color => !excludeColors.includes(color));
  const listToUse = availableColors.length > 0 ? availableColors : CATEGORY_COLORS;
  const randomIndex = Math.floor(Math.random() * listToUse.length);
  return listToUse[randomIndex];
};
