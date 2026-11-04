import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const host = document.querySelector('.hero-art');
const canvas = document.getElementById('hero3d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (host && canvas && !reduceMotion) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x3158e8, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const keyLight = new THREE.PointLight(0xd8f36a, 38, 20);
    keyLight.position.set(-3, 3, 4);
    scene.add(keyLight);
    const blueLight = new THREE.PointLight(0x9db5ff, 28, 20);
    blueLight.position.set(3, -2, 3);
    scene.add(blueLight);

    const rig = new THREE.Group();
    scene.add(rig);

    const chip = new THREE.Group();
    rig.add(chip);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x17234d, metalness: .72, roughness: .24 });
    const topMat = new THREE.MeshStandardMaterial({ color: 0x3158e8, metalness: .52, roughness: .2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd8f36a, metalness: .68, roughness: .25, emissive: 0x26330a, emissiveIntensity: .22 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.05, 2.05, .32), baseMat);
    chip.add(base);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.66, 1.66, .12), topMat);
    lid.position.z = .22;
    chip.add(lid);
    const core = new THREE.Mesh(new THREE.BoxGeometry(.82, .82, .16), goldMat);
    core.position.z = .38;
    chip.add(core);
    const coreInset = new THREE.Mesh(new THREE.BoxGeometry(.55, .55, .035), new THREE.MeshStandardMaterial({ color: 0x202b50, metalness: .35, roughness: .3 }));
    coreInset.position.z = .48;
    chip.add(coreInset);

    const pinGeo = new THREE.BoxGeometry(.13, .25, .09);
    for (let i = -3; i <= 3; i++) {
      for (const side of [-1, 1]) {
        const p1 = new THREE.Mesh(pinGeo, goldMat);
        p1.position.set(i * .24, side * 1.12, 0);
        chip.add(p1);
        const p2 = new THREE.Mesh(pinGeo, goldMat);
        p2.rotation.z = Math.PI / 2;
        p2.position.set(side * 1.12, i * .24, 0);
        chip.add(p2);
      }
    }

    const orbitMat = new THREE.MeshStandardMaterial({ color: 0xd8f36a, metalness: .55, roughness: .25, emissive: 0x26330a, emissiveIntensity: .18 });
    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.85, .018, 8, 120), orbitMat);
    orbitA.rotation.set(.9, .35, -.35);
    rig.add(orbitA);
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(2.22, .012, 8, 120), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .4, roughness: .3, transparent: true, opacity: .65 }));
    orbitB.rotation.set(1.2, -.55, .45);
    rig.add(orbitB);

    const satelliteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .6, roughness: .2 });
    const satellites = [];
    [[-2.15,.85,.2],[2.1,-.8,.1],[1.75,1.45,-.3],[-1.8,-1.3,.1]].forEach((pos, index) => {
      const geo = index % 2 ? new THREE.IcosahedronGeometry(.13, 1) : new THREE.SphereGeometry(.095, 18, 18);
      const obj = new THREE.Mesh(geo, index % 2 ? goldMat : satelliteMat);
      obj.position.set(...pos);
      rig.add(obj);
      satellites.push(obj);
    });

    const stars = new THREE.Group();
    const starGeo = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 90; i++) {
      starPositions.push((Math.random() - .5) * 7, (Math.random() - .5) * 5, (Math.random() - .5) * 2 - 1);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    stars.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .018, transparent: true, opacity: .8 })));
    rig.add(stars);

    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    let visible = true;
    host.addEventListener('pointermove', event => {
      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
    });
    host.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: .05 });
    observer.observe(host);

    const resize = () => {
      const width = host.clientWidth, height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 430 ? 8.6 : 7.8;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      if (!visible) return;
      const t = clock.getElapsedTime();
      targetX += (pointerY * .22 - targetX) * .035;
      targetY += (pointerX * .32 - targetY) * .035;
      rig.rotation.x = targetX + Math.sin(t * .25) * .06;
      rig.rotation.y = targetY + t * .12;
      chip.rotation.z = Math.sin(t * .35) * .045;
      chip.position.y = Math.sin(t * .8) * .09;
      orbitA.rotation.z += .0018;
      orbitB.rotation.x += .0008;
      satellites.forEach((obj, i) => {
        obj.position.y += Math.sin(t * .7 + i) * .0009;
        obj.rotation.x += .003 + i * .0003;
        obj.rotation.y += .004;
      });
      stars.rotation.z = t * .008;
      renderer.render(scene, camera);
    });
    host.classList.add('webgl-ready');
    window.addEventListener('pagehide', () => {
      observer.disconnect();
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      renderer.dispose();
    }, { once: true });
  } catch (error) {
    console.warn('3D scene unavailable; showing the static artwork instead.', error);
  }
}
