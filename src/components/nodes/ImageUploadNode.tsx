import { memo, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ImageUploadNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const nodeData = data as Record<string, unknown>;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      updateNode(id, { imageUrl, state: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        <Handle type="source" position={Position.Right} id="image-output" />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <ImageIcon size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Image Upload'}
          </span>
        </div>

        {/* Upload Area */}
        <div className="p-3">
          <div
            onClick={handleUploadClick}
            className="w-full h-[140px] bg-black/30 border border-dashed border-white/[0.1] rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors"
          >
            {nodeData?.imageUrl && typeof nodeData.imageUrl === 'string' ? (
              <img src={nodeData.imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={20} className="text-white/20" />
                <span className="text-[10px] text-white/30">Click to upload</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Выход */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">Изображение</span>
        </div>
      </div>
    </div>
  );
});

ImageUploadNode.displayName = 'ImageUploadNode';
