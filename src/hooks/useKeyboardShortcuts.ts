import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const nodes = useStore((state) => state.nodes);
  const deleteNode = useStore((state) => state.deleteNode);
  const saveWorkflow = useStore((state) => state.saveWorkflow);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const canUndo = useStore((state) => state.canUndo);
  const canRedo = useStore((state) => state.canRedo);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input/textarea/contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Delete selected nodes
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        selectedNodes.forEach((node) => deleteNode(node.id));
        event.preventDefault();
      }

      // Select all (Cmd/Ctrl + A)
      if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
        // React Flow handles this internally
        event.preventDefault();
      }

      // Save (Cmd/Ctrl + S)
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        const json = saveWorkflow();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workflow-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('✅ Workflow saved');
        event.preventDefault();
      }

      // Undo (Cmd/Ctrl + Z)
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        if (canUndo()) {
          undo();
          console.log('⏪ Undo');
        }
        event.preventDefault();
      }

      // Redo (Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y)
      if (
        ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'z') ||
        ((event.metaKey || event.ctrlKey) && event.key === 'y')
      ) {
        if (canRedo()) {
          redo();
          console.log('⏩ Redo');
        }
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, deleteNode, saveWorkflow, undo, redo, canUndo, canRedo]);
}

