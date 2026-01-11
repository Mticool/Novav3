import { useEffect, useState } from 'react';
import { ReactFlow, Background, useNodesState, useEdgesState, ConnectionLineType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Image as ImageIcon, Video, Sparkles } from 'lucide-react';

const SimpleHeroNode = ({ data }: any) => {
    const Icon = data.icon || Sparkles;
    return (
        <div className="p-4 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[180px]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.colorClass}`}>
                <Icon size={20} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{data.type}</span>
                <span className="text-xs font-semibold text-white/90">{data.label}</span>
            </div>
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1a1a] border-2 border-white/20 rounded-full" />
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1a1a] border-2 border-white/20 rounded-full" />
        </div>
    );
};

const nodeTypes = { hero: SimpleHeroNode };

const initialNodes = [
    {
        id: '1',
        type: 'hero',
        position: { x: 50, y: 100 },
        data: { label: 'Cinematic Prompt', type: 'Prompt', icon: Wand2, colorClass: 'bg-[#EFFE17]/20 text-[#EFFE17]' }
    },
    {
        id: '2',
        type: 'hero',
        position: { x: 300, y: 50 },
        data: { label: 'Sora 2 Model', type: 'Video', icon: Video, colorClass: 'bg-purple-500/20 text-purple-400' }
    },
    {
        id: '3',
        type: 'hero',
        position: { x: 50, y: 300 },
        data: { label: 'Style Reference', type: 'Image', icon: ImageIcon, colorClass: 'bg-blue-500/20 text-blue-400' }
    }
];

const initialEdges: any[] = [];

export const HeroCanvas = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((s) => (s + 1) % 6);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (step === 0) {
            setEdges([]);
            setNodes(initialNodes);
        } else if (step === 1) {
            setEdges([{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#EFFE17', strokeWidth: 2 } }]);
        } else if (step === 2) {
            setEdges((eds) => [...eds, { id: 'e3-2', source: '3', target: '2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }]);
        } else if (step === 3) {
            setNodes((nds) => nds.map(n => n.id === '2' ? { ...n, position: { x: n.position.x + 20, y: n.position.y } } : n));
        }
    }, [step]);

    return (
        <div className="w-full h-full relative group">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                colorMode="dark"
                fitView
                preventScrolling
                nodesConnectable={false}
                nodesDraggable={true}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false}
                connectionLineType={ConnectionLineType.Bezier}
            >
                <Background gap={20} color="rgba(255, 255, 255, 0.05)" />
            </ReactFlow>

            <AnimatePresence>
                {step >= 4 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute right-8 bottom-8 w-[240px] aspect-video bg-black/80 rounded-2xl border-2 border-[#EFFE17]/50 overflow-hidden shadow-[0_0_60px_rgba(239,254,23,0.3)] z-50 flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                            <span className="text-[10px] font-black text-[#EFFE17] tracking-widest uppercase">Rendering Cinematic 4K...</span>
                        </div>
                        <Sparkles size={40} className="text-[#EFFE17] animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
