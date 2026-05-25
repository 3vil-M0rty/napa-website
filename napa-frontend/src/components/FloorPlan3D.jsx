// src/components/FloorPlan3D.jsx
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const ZONE_COLORS = {
  bar: '#6b1414',
  terrace: '#4a5a2a',
  'main-hall': '#2a3a5a',
  private: '#5a2a5a',
}

const ZONE_COLORS_AVAILABLE = {
  bar: '#8b2424',
  terrace: '#5a7a3a',
  'main-hall': '#3a5a8a',
  private: '#7a3a7a',
}

function TableMesh({ table, available, selected, onClick }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += hovered ? 0.008 : 0.002
    }
  })

  const baseColor = available
    ? (ZONE_COLORS_AVAILABLE[table.zone] || '#3a5a3a')
    : '#2a2020'

  const color = selected ? '#c9a96e' : hovered ? new THREE.Color(baseColor).multiplyScalar(1.4).getHexString() : baseColor
  const scale = selected ? 1.1 : hovered ? 1.05 : 1

  const x = (table.position?.x || 0)
  const z = (table.position?.z || 0)

  return (
    <group position={[x, 0, z]} onClick={onClick} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      <RoundedBox ref={mesh} args={[1.2, 0.3, 1.2]} radius={0.08} scale={scale}>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </RoundedBox>
      {/* Chairs */}
      {[...Array(Math.min(table.capacity, 4))].map((_, i) => {
        const angle = (i / Math.min(table.capacity, 4)) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 6]} />
            <meshStandardMaterial color={color} roughness={0.6} opacity={0.7} transparent />
          </mesh>
        )
      })}
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.22}
        color={available ? '#f5d5d5' : '#666'}
        font={undefined}
        anchorX="center"
        anchorY="middle"
      >
        {table.number}
      </Text>
      {!available && (
        <Text position={[0, 0.6, 0]} fontSize={0.16} color="#666" anchorX="center" anchorY="middle">×</Text>
      )}
    </group>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 8]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshStandardMaterial color="#1a1010" roughness={0.9} />
    </mesh>
  )
}

export default function FloorPlan3D({ tables = [], availableIds = [], selectedTable, onSelectTable }) {
  return (
    <div style={{ width: '100%', height: '420px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(201,169,110,0.2)', background: '#0d0a0a' }}>
      <Canvas
        camera={{ position: [0, 14, 16], fov: 50 }}
        shadows
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1} color="#ffd580" castShadow />
        <pointLight position={[-5, 6, -5]} intensity={0.5} color="#c9a96e" />
        <pointLight position={[5, 6, 15]} intensity={0.3} color="#6b1414" />

        <Floor />

        {tables.map(table => (
          <TableMesh
            key={table._id}
            table={table}
            available={availableIds.includes(table._id)}
            selected={selectedTable?._id === table._id}
            onClick={() => availableIds.includes(table._id) && onSelectTable(table)}
          />
        ))}

        <OrbitControls
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={8}
          maxDistance={28}
          enablePan={false}
        />
      </Canvas>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', gap: '12px', padding: '8px 12px', fontSize: '0.65rem', fontFamily: 'var(--font-label)', letterSpacing: '1px' }}>
        {Object.entries(ZONE_COLORS_AVAILABLE).map(([zone, color]) => (
          <span key={zone} style={{ color: '#c9a96e', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: color, borderRadius: '1px' }} />
            {zone}
          </span>
        ))}
      </div>
    </div>
  )
}