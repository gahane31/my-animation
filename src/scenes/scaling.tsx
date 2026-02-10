import {makeScene2D, Circle, Rect, Txt, Line, Layout, Node, type RectProps} from '@motion-canvas/2d';
import {createRef, all, waitFor, chain, easeInCubic, easeOutCubic, linear, loop} from '@motion-canvas/core';

// --- CUSTOM COMPONENTS (To make it look pro without images) ---

// 1. A Professional Server Icon (Rectangle with blinking lights)
const ServerIcon = (props: RectProps) => (
  <Rect
    fill="#1e293b" // Dark Slate
    stroke="#475569"
    lineWidth={4}
    radius={8}
    width={100}
    height={140}
    {...props}
  >
    {/* Server Vents */}
    <Rect width={80} height={4} fill="#334155" y={-40} />
    <Rect width={80} height={4} fill="#334155" y={-20} />
    
    {/* Blinking Lights */}
    <Circle width={10} height={10} fill="#22c55e" x={-25} y={40} />
    <Circle width={10} height={10} fill="#22c55e" x={0} y={40} />
    <Circle width={10} height={10} fill="#ef4444" x={25} y={40} />
    
    {props.children}
  </Rect>
);

// 2. A Database Icon (Cylinder shape)
const DatabaseIcon = (props: RectProps) => (
  <Rect
    width={100}
    height={120}
    fill="#0f172a"
    stroke="#cbd5e1"
    lineWidth={4}
    radius={50} // High radius makes it look round like a cylinder
    {...props}
  >
    <Rect width={100} height={20} y={-30} stroke="#cbd5e1" lineWidth={4} />
    <Rect width={100} height={20} y={10} stroke="#cbd5e1" lineWidth={4} />
    {props.children}
  </Rect>
);

// --- THE MAIN ANIMATION SCENE ---

export default makeScene2D(function* (view) {
  // REFS (The handles we use to control objects)
  const server = createRef<Rect>();
  const db = createRef<Rect>();
  const cache = createRef<Rect>();
  const userGroup = createRef<Layout>();
  
  // SETUP THE SCENE
  view.add(
    <Layout>
      {/* 1. USERS GROUP (Left Side) */}
      <Layout ref={userGroup} x={-500} gap={20} layout direction="column">
        <Circle size={40} fill="#3b82f6"><Txt fill="white" scale={0.5}>User</Txt></Circle>
      </Layout>

      {/* 2. SERVER (Center) */}
      <ServerIcon ref={server} x={0} />
      
      {/* 3. DATABASE (Right Side) */}
      <DatabaseIcon ref={db} x={400} />

      {/* 4. CACHE (Hidden for now) */}
      <Rect 
        ref={cache} 
        width={100} height={100} 
        fill="#f59e0b" // Amber/Redis color
        radius={10} 
        x={200} y={-200} 
        opacity={0} // Hidden initially
      >
        <Txt fill="white" fontFamily="JetBrains Mono">Redis</Txt>
      </Rect>

      {/* LABELS */}
      <Txt x={0} y={150} fill="white" fontFamily="JetBrains Mono" scale={0.8}>
        App Server
      </Txt>
      <Txt x={400} y={150} fill="white" fontFamily="JetBrains Mono" scale={0.8}>
        Primary DB
      </Txt>
    </Layout>
  );

  // --- ANIMATION START ---

  // PHASE 1: THE HAPPY PATH (One User)
  // Create a packet
  const packet = createRef<Circle>();
  view.add(<Circle ref={packet} size={15} fill="#facc15" opacity={0} />);
  
  // Animate: User -> Server
  packet().position([-500, 0]);
  packet().opacity(1);
  yield* packet().position(server().position(), 1, easeInCubic);
  
  // Animate: Server -> DB
  yield* packet().position(db().position(), 1, easeOutCubic);
  
  // Database "Process" Pulse
  yield* db().scale(1.1, 0.1).to(1, 0.1);
  
  // Animate: DB -> Server -> User (Response)
  yield* packet().position(server().position(), 0.5);
  yield* packet().position([-500, 0], 0.5);
  packet().remove(); // Delete packet
  
  yield* waitFor(0.5);

  // PHASE 2: THE TRAFFIC SPIKE (The Crash)
  // Add more users rapidly
  for (let i = 0; i < 5; i++) {
    userGroup().add(<Circle size={40} fill="#3b82f6" />);
  }
  yield* waitFor(0.5);

  // Simulate chaos: Server turns RED and shakes
  yield* all(
    server().fill("#7f1d1d", 1), // Turn dark red
    server().rotation(5, 0.1).to(-5, 0.1).to(5, 0.1).to(0, 0.1), // Shake
  );
  
  yield* waitFor(1);

  // PHASE 3: VERTICAL SCALING (Bigger Server)
  // Reset color
  yield* server().fill("#1e293b", 0.5);
  
  // Scale UP!
  yield* server().scale(2, 1); // Make server huge
  
  yield* waitFor(0.5);
  
  // PHASE 4: DATABASE BOTTLENECK
  // Server handles it, but now DB crashes
  yield* all(
    db().fill("#7f1d1d", 1), // DB turns red
    db().rotation(5, 0.1).to(-5, 0.1).to(5, 0.1).to(0, 0.1), // DB Shake
  );

  yield* waitFor(1);

  // PHASE 5: ADDING CACHE
  // Reset DB
  yield* db().fill("#0f172a", 0.5);
  
  // Bring in the Cache
  yield* cache().opacity(1, 1);
  yield* cache().position.y(0, 1); // Move down into line
  
  // Re-arrange layout: Move Server left, DB right to make space
  yield* all(
    server().position.x(-200, 1),
    db().position.x(500, 1),
    cache().position.x(150, 1),
  );

  // Demonstrate Cache Hit
  // 1. Packet -> Server
  const cachePacket = createRef<Circle>();
  view.add(<Circle ref={cachePacket} size={15} fill="#facc15" position={[-500, 0]} />);
  
  yield* cachePacket().position(server().position(), 1);
  
  // 2. Server -> Cache (Check cache)
  yield* cachePacket().position(cache().position(), 0.5);
  yield* cache().scale(1.2, 0.1).to(1, 0.1); // Cache Pulse (Hit!)
  
  // 3. Cache -> Server (Return data immediately)
  yield* cachePacket().position(server().position(), 0.5);
  
  // 4. Server -> User (Fast response!)
  yield* cachePacket().position([-500, 0], 0.5);
  
  yield* waitFor(2);
});
