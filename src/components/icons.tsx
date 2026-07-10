import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

type IconProps = { color: string; size?: number };

// Journal tab — page / newspaper. Mirrors the prototype's 24×24 stroke icon.
export function JournalIcon({ color, size = 21 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={4} y={4} width={16} height={16} rx={1.6} />
      <Path d="M8 8.5h8M8 12h8M8 15.5h5" />
    </Svg>
  );
}

// Terme tab — scales / balance of justice (échoing the "Mot du jour" theme).
export function ScaleIcon({ color, size = 21 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.35} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 4.6V20" />
      <Path d="M8.5 20h7" />
      <Path d="M4 7.6h16" />
      <Circle cx={12} cy={4.4} r={1.15} fill={color} stroke="none" />
      <Path d="M4 7.6 1.3 12.4h5.4z" />
      <Path d="M20 7.6 17.3 12.4h5.4z" />
    </Svg>
  );
}
