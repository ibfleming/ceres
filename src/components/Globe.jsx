import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import earthImage from '../assets/imgs/earth-blue-marble.jpg';
import earthBumpImage from '../assets/imgs/earth-topology.png';
import earthSpecular from '../assets/imgs/earth-water.png';
import AirplaneModel from '../assets/models/boeing.glb';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const MAP_CENTER = { lat: 7.5, lng: 0, altitude: 2 };

const World = () => {
	const globeRef = useRef();
	const airplane = useRef();
	const globe = useRef();
	const orbitAngle = useRef(0);

	const globeMaterial = new THREE.MeshPhongMaterial();
	globeMaterial.bumpScale = 10;
	new THREE.TextureLoader().load(earthSpecular, (texture) => {
		globeMaterial.specularMap = texture;
		globeMaterial.specular = new THREE.Color('grey');
		globeMaterial.shininess = 15;
	});

	useEffect(() => {
		const initializeGlobe = () => {
			console.log('Init Globe!');

			globe.current = globeRef.current;

			// Controls
			const controls = globe.current.controls();
			controls.enableRotate = true;
			controls.autoRotate = true;
			controls.autoRotateSpeed = 0.5;
			controls.enableZoom = false;
			controls.enablePan = false;

			// Perspective
			globe.current.pointOfView(MAP_CENTER, 0);

			// Renderer
			const renderer = globe.current.renderer();
			renderer.setPixelRatio(1);
			renderer.shadowMap.enabled = true;
			renderer.antialias = true;

			// Model
			const loader = new GLTFLoader();
			loader.load(
				AirplaneModel,
				(glb) => {
					console.log('Model loaded:', glb);
					airplane.current = glb.scene;
					airplane.current.scale.set(16, 16, 10);

					// Change material
					airplane.current.traverse((node) => {
						if (node.isMesh) {
							node.material = new THREE.MeshPhongMaterial({
								color: 0xffffff,
								specular: 0x222222,
								shininess: 80,
							});
							node.material.needsUpdate = true;
						}
					});

					globe.current.scene().add(airplane.current);
				},
				undefined,
				(error) => {
					console.error(error);
				}
			);

			// Lighting
			const directionalLight = globeRef.current
				.lights()
				.find((obj3d) => obj3d.type === 'DirectionalLight');
			directionalLight && directionalLight.position.set(1, 1, 1);
		};

		const orbit = () => {
			if (airplane.current && globe.current) {
				const radius = globe.current.getGlobeRadius() * 1.15; // Orbit radius
				const speed = 0.003; // Orbit speed
				orbitAngle.current += speed; // Increment the angle
				const x = radius * Math.cos(orbitAngle.current);
				const z = radius * Math.sin(orbitAngle.current);
				airplane.current.position.set(x, 0, z); // Set airplane position
				airplane.current.lookAt(new THREE.Vector3(0, 0, 0)); // Orient airplane towards the globe
			}
			requestAnimationFrame(orbit); // Loop the animation
		};

		initializeGlobe();
		orbit();
	}, []);

	return (
		<div className='logo'>
			<div className='flex relative w-fit hover:cursor-pointer'>
				<Globe
					ref={globeRef}
					globeMaterial={globeMaterial}
					width={384}
					height={384}
					// Images
					globeImageUrl={earthImage}
					bumpImageUrl={earthBumpImage}
					backgroundColor='rgba(0,0,0,0)'
					showAtmosphere={true}
					atmosphereColor='rgb(207, 222, 231)'
					enableGlobeGlow={true}
					enableBackground={false}
					enableClouds={false}
					animateIn={false}
					enablePointerInteraction={false}
				/>
			</div>
			<div className='ml-5'>
				<div className='flex items-end'>
					<h1 className='font-sofachrome italic text-secondary text-5xl'>
						CERES,
					</h1>
					<h1 className='font-sofachrome italic text-secondary text-2xl ml-3'>
						Corp.
					</h1>
				</div>
				<div className='flex pl-2'>
					<h1 className=' text-secondary text-sm mt-2 tracking-wide'>
						Professional, Cost-effective Environmental Services
					</h1>
				</div>
			</div>
		</div>
	);
};

export default World;
