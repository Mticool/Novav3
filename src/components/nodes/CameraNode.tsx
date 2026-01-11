import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Camera, Loader2, RotateCw, RefreshCw } from 'lucide-react';
import { useStore } from '../../store/useStore';

type CameraView = 'front' | 'top' | 'bottom';

// 3D Cube Preview Component (Freepik style)
const CubePreview = ({
  rotateAngle,
  verticalAngle
}: {
  rotateAngle: number;
  verticalAngle: number;
}) => {
  const cubeSize = 80;
  const halfSize = cubeSize / 2;

  return (
    <div
      className="relative w-full h-48 flex items-center justify-center bg-[#0a0a0a] rounded-xl overflow-hidden"
      style={{ perspective: '600px' }}
    >
      {/* 3D Cube */}
      <div
        className="relative"
        style={{
          width: cubeSize,
          height: cubeSize,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-verticalAngle}deg) rotateY(${rotateAngle}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Front face */}
        <div
          className="absolute flex items-center justify-center bg-[#2a2a2a] border border-white/20 text-[10px] text-white/60 font-medium"
          style={{
            width: cubeSize,
            height: cubeSize,
            transform: `translateZ(${halfSize}px)`,
          }}
        >
          ЛИЦЕВАЯ СТОРОНА
        </div>

        {/* Back face */}
        <div
          className="absolute flex items-center justify-center bg-[#2a2a2a] border border-white/20 text-[10px] text-white/60 font-medium"
          style={{
            width: cubeSize,
            height: cubeSize,
            transform: `rotateY(180deg) translateZ(${halfSize}px)`,
          }}
        >
          ЗАДНЯЯ
        </div>

        {/* Right face */}
        <div
          className="absolute flex items-center justify-center bg-[#333] border border-white/20 text-[10px] text-white/50 font-medium"
          style={{
            width: cubeSize,
            height: cubeSize,
            transform: `rotateY(90deg) translateZ(${halfSize}px)`,
          }}
        >
          Верно
        </div>

        {/* Left face */}
        <div
          className="absolute flex items-center justify-center bg-[#333] border border-white/20 text-[10px] text-white/50 font-medium"
          style={{
            width: cubeSize,
            height: cubeSize,
            transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
          }}
        >
          Влево
        </div>

        {/* Top face */}
        <div
          className="absolute flex items-center justify-center bg-[#222] border border-white/20 text-[10px] text-white/40 font-medium"
          style={{
            width: cubeSize,
            height: cubeSize,
            transform: `rotateX(90deg) translateZ(${halfSize}px)`,
          }}
        >
          ВЕРХ
        </div>

        {/* Bottom face */}
        <div
          className="absolute flex items-center justify-center bg-[#222] border border-white/20 text-[10px] text-white/40 font-medium"
          style={{
            width: cubeSize,
            height: cubeSize,
            transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
          }}
        >
          НИЗ
        </div>
      </div>
    </div>
  );
};

export const CameraNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const rotateCamera = useStore(s => s.rotateCamera);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  // Three controls like Freepik
  const [rotateAngle, setRotateAngle] = useState<number>((data as Record<string, unknown>)?.rotateAngle as number ?? 0);
  const [verticalAngle, setVerticalAngle] = useState<number>((data as Record<string, unknown>)?.verticalAngle as number ?? 0);
  const [closeUp, setCloseUp] = useState<number>((data as Record<string, unknown>)?.closeUp as number ?? 0);

  // Legacy compatibility
  const angle = rotateAngle;
  const view: CameraView = verticalAngle > 20 ? 'top' : verticalAngle < -20 ? 'bottom' : 'front';

  const handleRotate = () => {
    // Find connected image node
    const incomingEdge = edges.find(e => e.target === id);
    if (incomingEdge) {
      const sourceNode = nodes.find(n => n.id === incomingEdge.source);
      if (sourceNode && sourceNode.data.imageUrl) {
        // Save settings and trigger rotation
        updateNode(id, { rotateAngle, verticalAngle, closeUp, angle, view });
        rotateCamera(sourceNode.id, id, angle, view);
      } else {
        alert('Подключите узел с изображением!');
      }
    } else {
      alert('Подключите Image узел для поворота!');
    }
  };

  const handleReset = () => {
    setRotateAngle(0);
    setVerticalAngle(0);
    setCloseUp(0);
    updateNode(id, { rotateAngle: 0, verticalAngle: 0, closeUp: 0, angle: 0, view: 'front' });
  };

  const nodeData = data as Record<string, unknown>;
  const isLoading = nodeData?.state === 'loading';
  const hasError = nodeData?.state === 'error';
  const outputImage = nodeData?.outputImage as string | undefined;

  return (
    <div className={`
      node-card
      ${selected ? 'selected' : ''}
      ${isLoading ? 'opacity-80' : ''}
    `}>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-[#1a1a1a] !border-2 !border-white/20"
      />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white/60 node-title">
          <Camera size={14} />
          <span>Изменить угол камеры #{id.slice(-1)}</span>
        </div>
        <span className="text-xs text-white/40 node-detail">Экспериментальный</span>
      </div>

      {/* 3D Cube Preview */}
      <div className="px-4 pb-4 node-detail">
        <CubePreview
          rotateAngle={rotateAngle}
          verticalAngle={verticalAngle}
        />

        {/* Output Image Preview (if available) */}
        {outputImage && !isLoading && (
          <div className="mt-3 relative group">
            <img
              src={outputImage}
              alt="Result"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-white">Результат</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls - Freepik style pills */}
      <div className="px-4 pb-4 space-y-4 node-detail">
        {/* Control Pills */}
        <div className="flex gap-2 justify-center flex-wrap">
          {/* Rotate control */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
            <span className="text-xs text-white/70">Повернуть</span>
            <input
              type="number"
              value={rotateAngle}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setRotateAngle(val);
                updateNode(id, { rotateAngle: val });
              }}
              className="w-12 bg-transparent text-xs text-white text-center outline-none"
              disabled={isLoading}
            />
            <span className="text-xs text-white/50">°</span>
          </div>

          {/* Vertical control */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
            <span className="text-xs text-white/70">Вертикаль</span>
            <input
              type="number"
              value={verticalAngle}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setVerticalAngle(val);
                updateNode(id, { verticalAngle: val });
              }}
              className="w-12 bg-transparent text-xs text-white text-center outline-none"
              disabled={isLoading}
            />
            <span className="text-xs text-white/50">°</span>
          </div>

          {/* Close-up control */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
            <span className="text-xs text-white/70">Крупный план</span>
            <input
              type="number"
              value={closeUp}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setCloseUp(val);
                updateNode(id, { closeUp: val });
              }}
              className="w-10 bg-transparent text-xs text-white text-center outline-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <RefreshCw size={12} />
            Сбросить
          </button>
        </div>

        {/* Loading/Generate button */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-3 text-purple-400">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-sm">Обработка...</span>
          </div>
        ) : (
          <button
            onClick={handleRotate}
            className="w-full py-2.5 btn-neon rounded-xl text-sm font-medium flex items-center justify-center gap-2"
          >
            <RotateCw size={16} />
            Применить
          </button>
        )}

        {hasError && (
          <div className="text-xs text-red-400 text-center bg-red-500/10 rounded-lg px-3 py-2">
            {(nodeData?.error as string) || 'Ошибка при повороте'}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-[#1a1a1a] !border-2 !border-white/20"
      />
    </div>
  );
});

CameraNode.displayName = 'CameraNode';
