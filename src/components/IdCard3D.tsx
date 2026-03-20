import { Component, type ReactNode, Suspense } from 'react'
import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { Physics, RigidBody, BallCollider, CuboidCollider, useRopeJoint, useSphericalJoint, type RapierRigidBody } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial }) // rapier + meshline

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any // eslint-disable-line @typescript-eslint/no-explicit-any
    meshLineMaterial: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

const TAG_URL =
  'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb'
const BAND_URL =
  'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg'

function Band({ maxSpeed = 50 }) {
  const band = useRef<any>(null!) // eslint-disable-line @typescript-eslint/no-explicit-any
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2,
  }

  const { nodes, materials } = useGLTF(TAG_URL) as any // eslint-disable-line @typescript-eslint/no-explicit-any
  const texture = useTexture(BAND_URL) as THREE.Texture
  const cardTexture = useTexture('/vraj.png') as THREE.Texture
  cardTexture.flipY = true
  cardTexture.colorSpace = THREE.SRGBColorSpace
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  )
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera).sub(state.camera.position).normalize()
      const planeIntersect = state.camera.position.clone().add(vec.multiplyScalar(state.camera.position.length()))
      card.current?.setNextKinematicTranslation({
        x: planeIntersect.x - dragged.x,
        y: planeIntersect.y - dragged.y,
        z: planeIntersect.z - dragged.z,
      })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current) return
        const clampedV = ref.current.linvel()
        if (clampedV) {
          const speed = new THREE.Vector3(clampedV.x, clampedV.y, clampedV.z).length()
          if (speed > maxSpeed) {
            ref.current.setLinvel(
              vec.set(clampedV.x, clampedV.y, clampedV.z).normalize().multiplyScalar(maxSpeed),
              true
            )
          }
        }
      })
      // Update band curve
      if (j3.current && j2.current && j1.current) {
        curve.points[0].copy(j3.current.translation())
        curve.points[1].copy(j2.current.translation())
        curve.points[2].copy(j1.current.translation())
        curve.points[3].copy(fixed.current.translation())
        band.current.geometry.setPoints(curve.getPoints(32))
      }
      // Tilt card based on angular velocity
      if (card.current) {
        ang.copy(card.current.angvel())
        rot.copy(card.current.rotation())
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
      }
    }
  })

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e) => {
              ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            {/* Photo overlay on card front face */}
            <mesh position={[0, 0.5, 0.01]}>
              <planeGeometry args={[0.68, 0.88]} />
              <meshBasicMaterial map={cardTexture} toneMapped={false} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}

function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1.4, 0.05]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  )
}

export default function IdCard3D() {
  return (
    <ErrorBoundary>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }} gl={{ alpha: true }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={<LoadingFallback />}>
          <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band />
          </Physics>
        </Suspense>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </ErrorBoundary>
  )
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  componentDidCatch(error: Error) {
    console.error('IdCard3D error:', error)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%', height: '100%', background: '#111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#CC0000', fontFamily: 'monospace', fontSize: '0.7rem',
          padding: '1rem', textAlign: 'center',
        }}>
          3D Card Failed: {this.state.error}
        </div>
      )
    }
    return this.props.children
  }
}
