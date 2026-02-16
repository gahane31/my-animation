import { Rect, Txt, Circle, Icon, Line } from '@motion-canvas/2d';
import { 
  all, createRef, Reference, chain, linear, waitFor, Vector2
} from '@motion-canvas/core';

// --- CONFIG ---
export const Colors = {
  bg: '#141414',
  primary: '#FF7A18', // Brand Orange
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  nodeBg: '#1e1e1e',
  nodeBorder: '#333333',
  error: '#FF4444',
  success: '#44FF44',
};

// --- COMPONENTS ---

// 1. The Standard Node
export function SystemNode({ref, x, y, icon, label, scale=1, opacity=1}: any) {
  return (
    <Rect
      ref={ref}
      x={x} y={y}
      width={160} height={160}
      fill={Colors.nodeBg}
      stroke={Colors.nodeBorder}
      lineWidth={3}
      radius={30}
      scale={scale}
      opacity={opacity}
      shadowBlur={0}
      zIndex={1} // Keep nodes on top of lines
    >
      <Icon icon={icon} size={80} y={-10} fill={Colors.primary} />
      <Txt 
        text={label} y={60} 
        fill={Colors.text} fontSize={24} fontFamily={'JetBrains Mono'} textAlign={'center'} 
      />
    </Rect>
  );
}

// 2. The Connection Line (FIXED)
export function Connection({from, to, lineDash}: {from: Reference<Rect>, to: Reference<Rect>, lineDash?: number[]}) {
    return (
        <Line
            // FIX: Wrap in () => to wait for nodes to exist
            points={() => [from().position(), to().position()]} 
            lineWidth={4}
            stroke={Colors.nodeBorder}
            lineDash={lineDash}
            endArrow
            arrowSize={10}
            zIndex={-1} // Behind nodes
        />
    );
}

// --- ANIMATION HELPERS ---

// 3. Traffic Generator
export function* traffic(
  view: any,
  from: Reference<Rect>,
  to: Reference<Rect>,
  duration: number = 1,
  intensity: 'low' | 'high' | 'burst' | 'medium' = 'medium',
  color: string = Colors.primary
) {
  const count = intensity === 'burst' ? 15 : intensity === 'high' ? 8 : 3;
  const interval = duration / count;
  
  // Dynamic positions so traffic follows moving nodes
  const startPos = () => from().absolutePosition();
  const endPos = () => to().absolutePosition();

  for (let i = 0; i < count; i++) {
    const dot = createRef<Circle>();
    view.add(<Circle ref={dot} size={12} fill={color} position={startPos()} zIndex={100} />);
    yield* chain(
      dot().position(endPos(), 0.6, linear),
      dot().opacity(0, 0.1),
    );
    dot().remove();
    yield* waitFor(interval);
  }
}

// 4. Status Effects
export function* highlight(node: Reference<Rect>) {
  yield* all(
    node().stroke(Colors.primary, 0.3),
    node().shadowColor(Colors.primary, 0.3),
    node().shadowBlur(40, 0.3),
  );
}

export function* error(node: Reference<Rect>) {
  yield* all(node().stroke(Colors.error, 0.3), node().shadowColor(Colors.error, 0.3), node().shadowBlur(40, 0.3));
  // Shake
  const x = node().x();
  yield* chain(node().x(x+10, 0.05), node().x(x-10, 0.05), node().x(x+10, 0.05), node().x(x, 0.05));
}

export function* reset(node: Reference<Rect>) {
  yield* all(node().stroke(Colors.nodeBorder, 0.3), node().shadowBlur(0, 0.3), node().scale(1, 0.3));
}