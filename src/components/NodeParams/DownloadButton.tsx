import { memo } from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  url?: string;
  filename: string;
  type?: 'image' | 'video';
}

export const DownloadButton = memo(({ url, filename, type = 'image' }: DownloadButtonProps) => {
  if (!url) return null;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}-${Date.now()}.${type === 'video' ? 'mp4' : 'png'}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: direct link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${Date.now()}.${type === 'video' ? 'mp4' : 'png'}`;
      link.click();
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/20 rounded-lg text-white/60 hover:text-white transition-all backdrop-blur-sm"
      title="Download"
    >
      <Download size={12} />
    </button>
  );
});

DownloadButton.displayName = 'DownloadButton';
