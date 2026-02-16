import { makeScene2D, Node, Txt, Rect } from '@motion-canvas/2d';
import { all, waitFor, createRef, useScene } from '@motion-canvas/core';
import { 
  SystemNode, 
  Connection, // <--- NEW IMPORT
  traffic, 
  highlight, 
  error, 
  reset, 
  Colors 
} from '../lib/SystemDesign';

export default makeScene2D(function* (view) {
  view.fill(Colors.bg);
  view.fontFamily('JetBrains Mono');

  const cam = createRef<Node>();
  const narrator = createRef<Txt>();

  // Refs
  const users = createRef<Rect>();
  const cdn = createRef<Rect>();
  const lb = createRef<Rect>();
  const app1 = createRef<Rect>();
  const app2 = createRef<Rect>();
  const app3 = createRef<Rect>();
  const cache = createRef<Rect>();
  const db = createRef<Rect>();
  const queue = createRef<Rect>();
  const worker = createRef<Rect>();
  const shards = createRef<Rect>();

  view.add(
    <Node ref={cam} position={[0, -200]}> {/* Start camera slightly higher */}
      
      {/* 1. DRAW CONNECTIONS FIRST (So they are behind nodes) */}
      <Connection from={users} to={lb} />
      <Connection from={lb} to={app1} />
      <Connection from={lb} to={app2} />
      <Connection from={lb} to={app3} />
      <Connection from={app1} to={db} />
      <Connection from={app2} to={db} />
      <Connection from={app3} to={db} />
      
      {/* 2. INSTANTIATE ACTORS (From New Layout) */}
      <SystemNode ref={users} label="Users" icon="material-symbols:group" x={0} y={-900} />
      <SystemNode ref={cdn} label="CDN" icon="material-symbols:globe" x={-300} y={-500} opacity={0} />
      <SystemNode ref={lb} label="LB" icon="material-symbols:balance" x={0} y={-400} opacity={0} />
      
      <SystemNode ref={app1} label="App 1" icon="material-symbols:dns" x={0} y={0} />
      <SystemNode ref={app2} label="App 2" icon="material-symbols:dns" x={-250} y={0} opacity={0} />
      <SystemNode ref={app3} label="App 3" icon="material-symbols:dns" x={250} y={0} opacity={0} />
      
      <SystemNode ref={cache} label="Redis" icon="material-symbols:bolt" x={350} y={-300} opacity={0} />
      <SystemNode ref={db} label="Primary" icon="material-symbols:database" x={0} y={500} opacity={0} />
      <SystemNode ref={queue} label="Queue" icon="material-symbols:layers" x={-350} y={250} opacity={0} />
      <SystemNode ref={worker} label="Worker" icon="material-symbols:settings" x={-350} y={500} opacity={0} />
      <SystemNode ref={shards} label="Shards" icon="material-symbols:grid-view" x={350} y={600} opacity={0} />
    </Node>
  );

  view.add(
    <Txt
      ref={narrator}
      text=""
      y={800}
      fill={Colors.textSecondary}
      fontSize={48}
      textAlign={'center'}
      width={900}
      textWrap={true}
    />
  );

  // --- ANIMATION START ---

  // STEP 1: HOOK
  narrator().text("Your app crashes at 1 Million users.");
  yield* all(
      cam().position([0, -450], 0), // Focus between Users and App
      cam().scale(0.9, 0),         // Wider shot
  );
  
  yield* highlight(users);
  yield* traffic(view, users, app1, 1.5, 'burst', Colors.error);
  yield* error(app1);
  yield* waitFor(0.5);

  // STEP 2: LB FIX
  narrator().text("Add a Load Balancer.");
  yield* all(
      cam().position([0, -200], 1), // Pan down smoothly
      reset(app1),
      lb().opacity(1, 0.5),
      app2().opacity(1, 0.5),
      app3().opacity(1, 0.5),
  );

  yield* all(
      traffic(view, users, lb, 1.5, 'high'),
      traffic(view, lb, app1, 1.5, 'medium'),
      traffic(view, lb, app2, 1.5, 'medium'),
      traffic(view, lb, app3, 1.5, 'medium'),
  );

  // STEP 3: DB BOTTLENECK
  narrator().text("Now the Database dies.");
  yield* all(
      cam().position([0, 250], 1), // Pan down to include App + DB
      db().opacity(1, 0.5),
  );

  yield* all(
      traffic(view, app1, db, 1, 'high'),
      traffic(view, app2, db, 1, 'high'),
      traffic(view, app3, db, 1, 'high'),
  );
  yield* error(db);
  yield* waitFor(1);

  // STEP 4: ASYNC FIX
  narrator().text("Fix with Cache & Queues.");
  yield* all(
      cam().position([0, 100], 1), // Center of the messy architecture
      cam().scale(0.75, 1),        // Zoom out to see EVERYTHING
      reset(db),
      cache().opacity(1, 0.5),
      queue().opacity(1, 0.5),
      worker().opacity(1, 0.5),
  );

  yield* all(
      traffic(view, app1, cache, 2, 'high', Colors.success),
      traffic(view, app3, cache, 2, 'high', Colors.success),
      traffic(view, app2, queue, 2, 'medium'),
      traffic(view, queue, worker, 2, 'medium'),
      traffic(view, worker, db, 2, 'low'),
  );

  yield* waitFor(2);
});