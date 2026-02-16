import {makeProject} from '@motion-canvas/core';
import generatedPipelineScene from './scenes/generatedPipelineScene.js?scene';

export default makeProject({
  scenes: [generatedPipelineScene],
  size: [1080, 1920], // Vertical 9:16 Resolution
});