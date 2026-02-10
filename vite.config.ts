import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

type PluginFactory = (...args: never[]) => unknown;
type MaybeDefault<T> = T | {default: T};

const resolveDefault = <T>(moduleValue: MaybeDefault<T>): T => {
  if (typeof moduleValue === 'object' && moduleValue !== null && 'default' in moduleValue) {
    return moduleValue.default;
  }

  return moduleValue;
};

const motionCanvasPlugin = resolveDefault(motionCanvas as MaybeDefault<PluginFactory>);
const ffmpegPlugin = resolveDefault(ffmpeg as MaybeDefault<PluginFactory>);

export default defineConfig({
  plugins: [
    motionCanvasPlugin(),
    ffmpegPlugin(),
  ],
});
