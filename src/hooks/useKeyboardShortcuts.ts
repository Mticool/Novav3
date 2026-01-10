import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const nodes = useStore((state) => state.nodes);
  const deleteNode = useStore((state) => state.deleteNode);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
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
        console.log('Save workflow');
        // TODO: Implement save
        event.preventDefault();
      }

      // Undo (Cmd/Ctrl + Z)
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        console.log('Undo');
        // TODO: Implement undo
        event.preventDefault();
      }

      // Redo (Cmd/Ctrl + Shift + Z)
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'z') {
        console.log('Redo');
        // TODO: Implement redo
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, deleteNode]);
}

