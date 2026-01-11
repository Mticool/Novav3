import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Upload, Image as ImageIcon, X, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ImageUploadNode = memo(({ id, data, selected }: NodeProps) => {
    const updateNode = useStore(s => s.updateNode);
    const [isDragging, setIsDragging] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, загрузите изображение');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            updateNode(id, { imageUrl, fileName: file.name });
        };
        reader.readAsDataURL(file);
    }, [id, updateNode]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleUrlSubmit = useCallback(() => {
        if (urlInput.trim()) {
            updateNode(id, { imageUrl: urlInput.trim(), fileName: 'URL Image' });
            setShowUrlInput(false);
            setUrlInput('');
        }
    }, [id, urlInput, updateNode]);

    const handleClear = useCallback(() => {
        updateNode(id, { imageUrl: null, fileName: null });
    }, [id, updateNode]);

    const imageUrl = data?.imageUrl as string | undefined;
    const fileName = data?.fileName as string | undefined;
    const nodeData = data as Record<string, unknown>;

    return (
        <div className="w-[280px]">
            {/* Title */}
            <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
                <Upload size={14} className="text-white/50" />
                <span className="text-white/80 font-medium">{(nodeData?.title as string) || 'Загрузка изображения'}</span>
            </div>

            <div
                className={`
          custom-node
          relative
          overflow-hidden
          ${isDragging ? 'border-accent-neon/50 bg-accent-neon/5' : ''}
          ${selected ? 'ring-2 ring-accent-neon/40 shadow-2xl shadow-accent-neon/10' : ''}
        `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {/* Output handle */}
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-cyan-400/50"
                />

                {imageUrl ? (
                    /* Image Preview */
                    <div className="relative group">
                        <img
                            src={imageUrl}
                            alt={fileName || 'Uploaded'}
                            className="w-full h-[180px] object-cover"
                        />

                        {/* Overlay with actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={handleClear}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition-colors"
                                title="Удалить"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* File name */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                            <span className="text-xs text-white/70 truncate block">{fileName}</span>
                        </div>
                    </div>
                ) : (
                    /* Upload Zone */
                    <div className="h-[180px] flex flex-col items-center justify-center p-4">
                        {showUrlInput ? (
                            <div className="w-full space-y-2">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none placeholder:text-white/30 focus:border-accent-neon/30"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUrlSubmit}
                                        className="flex-1 py-2 btn-neon rounded-xl text-xs font-medium"
                                    >
                                        Добавить
                                    </button>
                                    <button
                                        onClick={() => setShowUrlInput(false)}
                                        className="px-3 py-2 bg-white/5 rounded-xl text-xs text-white/60"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-accent-neon/20' : 'bg-white/5'}`}>
                                    <ImageIcon size={24} className={isDragging ? 'text-accent-neon' : 'text-white/30'} />
                                </div>

                                <p className="text-sm text-white/50 mb-1">
                                    {isDragging ? 'Отпустите для загрузки' : 'Перетащите изображение'}
                                </p>
                                <p className="text-xs text-white/30 mb-3">или</p>

                                <div className="flex gap-2">
                                    <label className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-white/70 cursor-pointer transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                        Выбрать файл
                                    </label>

                                    <button
                                        onClick={() => setShowUrlInput(true)}
                                        className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/50 transition-colors"
                                        title="Вставить URL"
                                    >
                                        <LinkIcon size={14} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

ImageUploadNode.displayName = 'ImageUploadNode';
