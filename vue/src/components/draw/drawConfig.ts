import type { InjectionKey, Ref } from 'vue'

export interface DrawPadContext {
  canvas: Ref<HTMLCanvasElement | null>
  ctx: Ref<CanvasRenderingContext2D | null>
  redoList: string[]
  undoList: string[]
  selectedTool: Ref<number>
  selectedColor: Ref<string>
  lineWidth: Ref<number>
  addCanvas: (el: HTMLCanvasElement) => void
  defaultCanvas: () => void
  saveState: (list?: string[], keep?: boolean) => void
  restoreState: (pop: string[], push: string[]) => void
  switchEraser: (eraser?: boolean) => void
}

export const drawPadKey: InjectionKey<DrawPadContext> = Symbol('drawPad')

export default {
  drawControls: true,
  width: 500,
  height: 500,
  canvasColor: '#fff',
  lineColor: '#000000',
  lineWidth: 1,
  undoLength: 30,
  storageKey: 'lineWriterCache',
  imageMime: 'image/png' as const,
  TOOL_PEN: 1,
  TOOL_ERASER: 2
}
