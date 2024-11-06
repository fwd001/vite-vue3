export const defaultIcon = 'dot-blue.png@@@20x20';
const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

export function formatIcon(icon?: string) {
  const iconName = icon?.split('@@@')?.[0];
  const [width, height] = icon?.split('@@@')?.[1]?.split?.('x') || [];
  return {
    iconName,
    width: Number(width) || 0,
    height: Number(height) || 0,
  };
}

export const iconPublicPath = publicPath + 'images/map/';
