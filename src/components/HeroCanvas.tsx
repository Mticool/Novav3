import { ReactFlow, Background, useNodesState, useEdgesState, ConnectionLineType, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Video, Camera, Sparkles, Orbit, ZoomIn, Move, Check } from 'lucide-react';

// --- Custom Nodes to match the Screenshot ---

const HeroPromptNode = () => (
    <div className="w-[280px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <span className="text-lg font-bold">T</span>
            </div>
            <div>
                <div className="text-sm font-black text-white uppercase tracking-wider">Prompt Node</div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Master Prompt AI</div>
            </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 text-[11px] text-white/70 leading-relaxed font-medium relative border border-white/5">
            Cinematic tracking shot of a futuristic city at sunset, neon lights reflecting on wet streets.
            <div className="absolute bottom-2 right-2 text-[#EFFE17]">
                <Sparkles size={14} />
            </div>
        </div>
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white/20 border-2 border-black !-right-1.5" />
    </div>
);

const HeroVideoNode = () => (
    <div className="w-[220px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Video size={18} />
            </div>
            <div>
                <div className="text-sm font-black text-white uppercase tracking-wider">Video Gen</div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Sora 2</div>
            </div>
        </div>
        <div className="space-y-3">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="h-full bg-purple-500"
                />
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                <span className="text-white/30">Status</span>
                <span className="text-purple-400">Generating...</span>
            </div>
        </div>
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white/20 border-2 border-black !-left-1.5" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white/20 border-2 border-black !-right-1.5" />
    </div>
);

const HeroCameraNode = () => (
    <div className="w-[220px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <Camera size={18} />
            </div>
            <div>
                <div className="text-sm font-black text-white uppercase tracking-wider">Camera Control</div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-tight">3D Perspective AI</div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            {[
                { icon: Orbit, label: 'Orbit' },
                { icon: ZoomIn, label: 'Zoom' },
                { icon: Move, label: 'Pan' },
                { icon: Check, label: 'Apply', active: true }
            ].map((btn, i) => (
                <div key={i} className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-tighter ${btn.active ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/30'}`}>
                    <btn.icon size={12} />
                    {btn.label}
                </div>
            ))}
        </div>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white/20 border-2 border-black !-top-1.5" />
    </div>
);

const HeroPolishNode = () => (
    <div className="w-[220px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-5 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                <Sparkles size={18} />
            </div>
            <div>
                <div className="text-sm font-black text-white uppercase tracking-wider">Final Polish</div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Flux Pro</div>
            </div>
        </div>
        <div className="space-y-3 opacity-40">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden" />
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                <span className="text-white/30">Status</span>
                <span className="text-white/30">Waiting</span>
            </div>
        </div>
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white/20 border-2 border-black !-left-1.5" />
    </div>
);

const nodeTypes = {
    prompt: HeroPromptNode,
    video: HeroVideoNode,
    camera: HeroCameraNode,
    polish: HeroPolishNode
};

const initialNodes = [
    { id: '1', type: 'prompt', position: { x: 50, y: 150 }, data: {} },
    { id: '2', type: 'video', position: { x: 420, y: 50 }, data: {} },
    { id: '3', type: 'camera', position: { x: 420, y: 320 }, data: {} },
    { id: '4', type: 'polish', position: { x: 750, y: 180 }, data: {} }
];

const initialEdges = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'bezier',
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2, strokeDasharray: '5,5' }
    },
    {
        id: 'e2-4',
        source: '2',
        target: '4',
        type: 'bezier',
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2, strokeDasharray: '5,5' }
    },
    {
        id: 'e3-2',
        source: '3',
        target: '2',
        type: 'bezier',
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '5,5' }
    }
];

export const HeroCanvas = () => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className="w-full h-full relative">
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
                panOnDrag={true}
                connectionLineType={ConnectionLineType.Bezier}
            >
                <Background gap={24} color="rgba(255, 255, 255, 0.03)" variant={'dots' as any} />
            </ReactFlow>

            {/* Top Badge */}
            <div className="absolute top-6 left-6 z-50">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Live Session: Novav3</span>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 p-1.5 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-2xl">
                    <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black text-white/50 uppercase transition-all tracking-wider">
                        Add Node
                    </button>
                    <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black text-white/50 uppercase transition-all tracking-wider">
                        Execute Workflow
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[11px] font-black text-white/50 uppercase transition-all tracking-wider">
                        Export 4K
                    </button>
                </div>
            </div>

            {/* Float Elements */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-50">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 font-bold">+</div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 font-bold">-</div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 p-2 opacity-50">
                    <Sparkles size={16} />
                </div>
            </div>

            {/* Mini Map Preview Mockup */}
            <div className="absolute bottom-8 right-8 w-40 h-24 bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl z-50 p-3 opacity-50 flex items-center justify-center gap-1 group">
                <div className="w-8 h-4 bg-white/10 rounded-sm" />
                <div className="flex flex-col gap-1">
                    <div className="w-8 h-4 bg-[#EFFE17]/20 rounded-sm" />
                    <div className="w-8 h-4 bg-white/10 rounded-sm" />
                </div>
                <div className="w-8 h-4 bg-white/10 rounded-sm" />
                <span className="absolute bottom-1 right-2 text-[8px] font-bold text-white/20 uppercase">Mini Map</span>
            </div>
        </div>
    );
};
