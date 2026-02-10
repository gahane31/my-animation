import {makeScene2D, Circle, Txt} from '@motion-canvas/2d';
import {createRef, all} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // 1. Create a reference for our circle
  const myCircle = createRef<Circle>();

  // 2. Draw the circle on the screen
  view.add(
    <Circle
      ref={myCircle}
      size={300}
      fill="#e13238" // Red color
    >
      <Txt 
        fill="white"
        fontFamily="Arial"
      >
        Hello!
      </Txt>
    </Circle>
  );

  // 3. Animate it!
  // This tells the circle to scale from 0 (invisible) to 1 (full size) in 1 second
  yield* myCircle().scale(0, 0).to(1, 1);
});