import React, { useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Text } from "@react-three/drei"

const bubbleStyle = {
  background: "white",
  padding: "10px 14px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  width: "160px",
  fontSize: "12px",
  textAlign: "center",
  pointerEvents: "auto"
}

function LightBeam({ color, angle, active }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current || !active) return
    ref.current.rotation.y += 0.01
    ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.2
  })

  if (!active) return null

  return (
    <mesh
      ref={ref}
      rotation={[Math.PI / 2, angle, 0]}
      position={[0, 4, -2]}
    >
      <coneGeometry args={[0.8, 7, 32, 1, true]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        emissive={color}
        emissiveIntensity={1}
        side={2}
        depthWrite={false}
      />
    </mesh>
  )
}

function DiscoBeams({ active }) {
  return (
    <>
      <LightBeam color="red" angle={0} active={active} />
      <LightBeam color="blue" angle={Math.PI / 2} active={active} />
      <LightBeam color="purple" angle={Math.PI} active={active} />
      <LightBeam color="cyan" angle={Math.PI * 1.5} active={active} />
    </>
  )
}

function DiscoBall({ active }) {
  const ballRef = useRef()
  const sparkleRef = useRef()

  useFrame(({ clock }) => {
    if (!ballRef.current) return

    ballRef.current.rotation.y += 0.01
    ballRef.current.rotation.x += 0.005

    if (sparkleRef.current) {
      sparkleRef.current.material.emissiveIntensity =
        0.5 + Math.sin(clock.getElapsedTime() * 4) * 0.5
    }
  })

  if (!active) return null

  return (
    <group position={[0, 4, -2]}>
      {/* Main mirror ball */}
      <mesh ref={ballRef}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial
          metalness={1}
          roughness={0.2}
          normalScale={[0.3, 0.3]}
        />
      </mesh>

      {/* Fake beam reflections */}
      <mesh ref={sparkleRef}>
        <sphereGeometry args={[0.51, 32, 32]} />
        <meshStandardMaterial
          transparent
          opacity={0.15}
          emissive="white"
          emissiveIntensity={1}
          blending={2}
        />
      </mesh>
    </group>
  )
}

function DiscoLights({ active }) {
  const light1 = useRef()
  const light2 = useRef()
  const light3 = useRef()

  useFrame(({ clock }) => {
    if (!active) return
    const t = clock.getElapsedTime()

    light1.current.position.x = Math.sin(t) * 5
    light2.current.position.z = Math.cos(t * 1.2) * 5
    light3.current.position.x = Math.sin(t * 0.7) * 5
  })

  if (!active) return null

  return (
    <>
      <pointLight ref={light1} color="red" intensity={5} />
      <pointLight ref={light2} color="blue" intensity={5} />
      <pointLight ref={light3} color="purple" intensity={5} />
    </>
  )
}

function DiscoButton({ onClick }) {
  return (
    <mesh position={[2, 1.5, -5.9]} onClick={onClick}>
      <boxGeometry args={[0.3, 0.3, 0.1]} />
      <meshStandardMaterial color="green" emissive="green" />
    </mesh>
  )
}

function Person({ position, color, role, info, interrogation, disco }) {
  const [active, setActive] = useState(false)
  const groupRef = useRef()
  const randomOffset = useRef(Math.random() * Math.PI * 2)
  const randomSpeed = useRef(0.8 + Math.random() * 0.4)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    
    const writingPose = interrogation && role === "student"
    const dancing = disco && role === "student"
    
    if (dancing) {
      const t = clock.getElapsedTime() * randomSpeed.current + randomOffset.current
      const jump = Math.abs(Math.sin(t * 2)) * 0.3
      groupRef.current.position.y = position[1] + jump
      groupRef.current.rotation.z = Math.sin(t * 3) * 0.15
    } else if (writingPose) {
      groupRef.current.position.y = position[1] - 0.15
      groupRef.current.rotation.x = -0.4
      groupRef.current.rotation.z = 0
    } else {
      groupRef.current.position.y = position[1]
      groupRef.current.rotation.x = 0
      groupRef.current.rotation.z = 0
    }
  })

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
    >
      <mesh onClick={() => setActive(!active)}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color={!active ? color : "yellow"} />
      </mesh>

      {active && (
        <Html position={[0, 0.8, 0]} center>
          <div style={bubbleStyle}>
            {role === "teacher" ? (
              <>
                <strong>{info.name}</strong>
                <div>{info.grade}</div>
                <div style={{ fontSize: "10px", marginTop: "5px" }}>
                  <a href={info.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </div>
              </>
            ) : (
              <div>
                <strong>Student</strong>
                <div style={{ fontSize: "10px", marginTop: "5px" }}>
                  Click to dismiss
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

function Desk({ position, showPaper }) {
  return (
    <group position={position}>
      {/* Desk */}
      <mesh>
        <boxGeometry args={[1, 0.1, 0.6]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      
      {/* Paper/Copy on desk during interrogation */}
      {showPaper && (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}
      
      {/* Text lines on paper */}
      {showPaper && (
        <>
          <mesh position={[-0.15, 0.061, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.02]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[-0.15, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.02]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[-0.15, 0.061, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.02]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </>
      )}
    </group>
  )
}

function InterrogationSubject({ active, subject }) {
  if (!active) return null

  return (
    <Text
      position={[0, 3.5, -5.8]}
      fontSize={0.6}
      color="darkred"
      anchorX="center"
      anchorY="middle"
    >
      {subject}
    </Text>
  )
}

function InterrogationButton({ onClick }) {
  return (
    <mesh position={[-2, 1.5, -5.9]} onClick={onClick}>
      <boxGeometry args={[0.35, 0.35, 0.15]} />
      <meshStandardMaterial
        color="darkred"
        emissive="red"
        emissiveIntensity={0.6}
      />
    </mesh>
  )
}

function Tree({ position }) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      
      {/* Tree foliage - bottom layer */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      
      {/* Tree foliage - top layer */}
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#3a6b1f" />
      </mesh>
    </group>
  )
}

function OutdoorScene() {
  const trees = []
  
  // Left side trees
  for (let i = 0; i < 4; i++) {
    trees.push(
      <Tree key={`left-${i}`} position={[-12, 0, -8 + i * 4]} />
    )
  }
  
  // Right side trees
  for (let i = 0; i < 4; i++) {
    trees.push(
      <Tree key={`right-${i}`} position={[12, 0, -8 + i * 4]} />
    )
  }
  
  // Back trees
  for (let i = 0; i < 3; i++) {
    trees.push(
      <Tree key={`back-${i}`} position={[-6 + i * 6, 0, -15]} />
    )
  }
  
  return (
    <>
      {/* Grass/Ground outside */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a7c2c" />
      </mesh>
      
      {trees}
      
      {/* Sky */}
      <mesh position={[0, 15, -25]}>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
    </>
  )
}

function Classroom() {
  const [interrogation, setInterrogation] = useState(false)
  const [disco, setDisco] = useState(false)

  const triggerInterrogation = () => {
    setInterrogation(!interrogation)
    setDisco(false)
  }

  const triggerDisco = () => {
    setInterrogation(false)
    setDisco(!disco)
  }

  const students = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      students.push(
        <group key={`${row}-${col}`}>
          <Desk position={[col * 1.5 - 2.25, 1, row * 1.5 - 1.5]} showPaper={interrogation} />
          <Person position={[col * 1.5 - 2.25, 1.2, row * 1.5 - 1]} color="#4a90e2" role="student" interrogation={interrogation} disco={disco} />
        </group>
      )
    }
  }

  useFrame(({ scene, clock }) => {
    if (!disco || !scene.fog) return
    scene.fog.near = 5 + Math.sin(clock.getElapsedTime()) * 0.5
  })

  return (
    <>
      {/* Outdoor scene */}
      <OutdoorScene />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={disco ? "black" : "#e0e0e0"} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3, -6]}>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Left wall with windows */}
      <mesh position={[-10, 3, 0]}>
        <boxGeometry args={[0.2, 6, 20]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Left windows */}
      <mesh position={[-9.9, 3, -2]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>
      <mesh position={[-9.9, 3, 2]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>
      
      {/* Right wall with windows */}
      <mesh position={[10, 3, 0]}>
        <boxGeometry args={[0.2, 6, 20]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Right windows */}
      <mesh position={[9.9, 3, -2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>
      <mesh position={[9.9, 3, 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Teacher */}
      <Person
        position={[0, 1.2, -3.5]}
        color="#e94e77"
        role="teacher"
        info={{
          name: "Ms. Johnson",
          grade: "5th Grade",
          github: "https://github.com/msjohnson"
        }}
      />

      {/* Teacher desk */}
      <Desk position={[0, 1, -3]} />

      {/* Students */}
      {students}
      
      <InterrogationButton onClick={triggerInterrogation} />

      <InterrogationSubject
        active={interrogation}
        subject="Math Test – Fractions"
      />
      
      {/* Disco button */}
      <DiscoButton onClick={triggerDisco} />

      {/* Disco effects */}
      <DiscoBall active={disco} />
      <DiscoLights active={disco} />
      <DiscoBeams active={disco} />
    </>
  )
}

export default function ClassroomScene() {
  return (
    <Canvas camera={{ position: [0, 6, 8], fov: 50 }} fog={{ color: "#000000", near: 5, far: 18 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Classroom />
      <OrbitControls />
    </Canvas>
  )
}