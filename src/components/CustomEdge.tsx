import { getBezierPath, EdgeProps } from '@xyflow/react';
import { useState } from 'react';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isHighlighted = selected || isHovered;

  return (
    <>
      {/* Shadow for depth effect */}
      <path
        id={`${id}-shadow`}
        style={{
          strokeWidth: isHighlighted ? 5 : 4,
          stroke: 'rgba(0, 0, 0, 0.3)',
          filter: 'blur(3px)',
          transition: 'all 0.2s ease',
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      
      {/* Invisible wide path for hover interaction */}
      <path
        id={`${id}-interaction`}
        style={{
          strokeWidth: 20,
          stroke: 'transparent',
          fill: 'none',
          cursor: 'pointer',
        }}
        className="react-flow__edge-interaction"
        d={edgePath}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {/* Main line */}
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: isHighlighted ? 3.5 : 2.5,
          stroke: isHighlighted
            ? 'rgba(96, 165, 255, 1)' 
            : 'rgba(100, 150, 255, 0.6)',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          filter: isHighlighted
            ? 'drop-shadow(0 0 8px rgba(96, 165, 255, 0.6))'
            : 'drop-shadow(0 0 4px rgba(100, 150, 255, 0.3))',
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
        }}
        className="react-flow__edge-path edge-hoverable"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* Glow effect on hover/selected */}
      {isHighlighted && (
        <path
          id={`${id}-glow`}
          style={{
            strokeWidth: 8,
            stroke: 'rgba(96, 165, 255, 0.2)',
            strokeLinecap: 'round',
            pointerEvents: 'none',
            animation: isHovered ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
          }}
          className="react-flow__edge-path"
          d={edgePath}
        />
      )}
    </>
  );
}

