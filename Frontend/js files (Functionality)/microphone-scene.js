// Isolated Three.js hero scene.
// Later, connect setAudioLevel() to live microphone input.

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
    const stage = document.getElementById("microphone-stage");

    if (!stage) {
        console.error('Could not find "#microphone-stage".');
        return;
    }

    const loaderElement = stage.querySelector(".scene-loader");
    const fallbackElement = document.getElementById("scene-fallback");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let scene;
    let camera;
    let renderer;
    let model = null;

    let baseScale = 1;
    let running = true;
    let clickPulse = 0;
    let audioLevel = 0;

    const clock = new THREE.Clock();
    const targetRotation = new THREE.Vector2(0, 0);
    const desiredScaleVector = new THREE.Vector3();

    function showError(message, error = null) {
        console.error(message, error || "");

        stage.classList.remove("is-loaded");
        stage.classList.add("has-error");

        if (loaderElement) {
            loaderElement.style.display = "none";
        }

        if (fallbackElement) {
            fallbackElement.hidden = false;
            fallbackElement.textContent = message;
        }
    }

    function showLoadedScene() {
        stage.classList.remove("has-error");
        stage.classList.add("is-loaded");

        if (loaderElement) {
            loaderElement.style.display = "none";
        }

        if (fallbackElement) {
            fallbackElement.hidden = true;
        }
    }

    try {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            34,
            1,
            0.1,
            100
        );

        camera.position.set(0, 0.35, 7.5);
        camera.lookAt(0, 0.15, 0);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2)
        );

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.domElement.setAttribute(
            "aria-label",
            "Interactive 3D microphone"
        );

        stage.appendChild(renderer.domElement);
    } catch (error) {
        showError("Your browser could not start the 3D microphone.", error);
        return;
    }

    /* ==========================================================
       LIGHTING
    ========================================================== */

    const hemisphereLight = new THREE.HemisphereLight(
        0xfff9ed,
        0x5a857d,
        2.25
    );

    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(
        0xffecd1,
        3.2
    );

    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);

    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
        0x8bc9c0,
        2.5
    );

    rimLight.position.set(-5, 3, -4);

    scene.add(rimLight);

    const warmGlow = new THREE.PointLight(
        0xf2b84b,
        22,
        12,
        2
    );

    warmGlow.position.set(0, 2.5, 3);

    scene.add(warmGlow);

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.ShadowMaterial({
            color: 0x315e56,
            opacity: 0.15
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.65;
    floor.receiveShadow = true;

    scene.add(floor);

    /* ==========================================================
       RESPONSIVE CANVAS
    ========================================================== */

    function resizeScene() {
        const { width, height } = stage.getBoundingClientRect();

        if (width <= 0 || height <= 0) {
            return;
        }

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
    }

    const resizeObserver = new ResizeObserver(resizeScene);

    resizeObserver.observe(stage);
    resizeScene();

    /* ==========================================================
       MODEL LOADING
    ========================================================== */

    const loader = new GLTFLoader();

    /*
       IMPORTANT:

        This root-relative path is served from the Vercel project root.

       Your structure should look similar to:

        Frontend/
        ├── html-files/
       │   └── index.html
       └── public/
           └── models/
               └── microphone.glb

       If your "public" folder is somewhere else, update this URL.
    */

     const modelUrl = "/public/models/microphone.glb";

    loader.load(
        modelUrl,

        (gltf) => {
            model = gltf.scene;

            model.traverse((node) => {
                if (!node.isMesh) {
                    return;
                }

                node.castShadow = true;
                node.receiveShadow = true;

                if (node.material) {
                    node.material.needsUpdate = true;
                }
            });

            const bounds = new THREE.Box3().setFromObject(model);
            const size = bounds.getSize(new THREE.Vector3());
            const center = bounds.getCenter(new THREE.Vector3());

            const largestDimension = Math.max(
                size.x,
                size.y,
                size.z
            );

            if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
                showError("The microphone model has invalid dimensions.");
                return;
            }

            baseScale = 4.50 / largestDimension;

            model.scale.setScalar(baseScale);

            model.position.set(
                -center.x * baseScale,
                -center.y * baseScale - 0.55,
                -center.z * baseScale
            );

            scene.add(model);

            showLoadedScene();

            console.log(
                "3D microphone loaded successfully:",
                modelUrl
            );
        },

        (progressEvent) => {
            if (!progressEvent.total) {
                return;
            }

            const percentage = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
            );

            console.log(`Microphone model loading: ${percentage}%`);
        },

        (error) => {
            showError(
                "The 3D microphone could not be loaded. Check the model path.",
                error
            );
        }
    );

    /* ==========================================================
       POINTER INTERACTIONS
    ========================================================== */

    stage.addEventListener("pointermove", (event) => {
        const box = stage.getBoundingClientRect();

        if (!box.width || !box.height) {
            return;
        }

        const x =
            ((event.clientX - box.left) / box.width) * 2 - 1;

        const y =
            -((event.clientY - box.top) / box.height) * 2 + 1;

        targetRotation.set(
            y * 0.12,
            x * 0.34
        );
    });

    stage.addEventListener("pointerenter", () => {
        stage.classList.add("is-hovered");
    });

    stage.addEventListener("pointerleave", () => {
        targetRotation.set(0, 0);
        stage.classList.remove("is-hovered");
    });

    stage.addEventListener("click", () => {
        clickPulse = 1;
    });

    window.addEventListener(
        "scroll",
        () => {
            if (!model) {
                return;
            }

            targetRotation.y = window.scrollY * 0.00035;
        },
        { passive: true }
    );

    /* ==========================================================
       VISIBILITY CONTROL
    ========================================================== */

    const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
            running = entry.isIntersecting;

            if (running) {
                clock.start();
                renderer.setAnimationLoop(render);
            } else {
                renderer.setAnimationLoop(null);
            }
        },
        {
            threshold: 0.05
        }
    );

    intersectionObserver.observe(stage);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            renderer.setAnimationLoop(null);
            return;
        }

        if (running) {
            renderer.setAnimationLoop(render);
        }
    });

    /* ==========================================================
       FUTURE AUDIO INTEGRATION
    ========================================================== */

    window.ImPromptUMicrophone = {
        setAudioLevel(value) {
            const numericValue = Number(value);

            audioLevel = THREE.MathUtils.clamp(
                Number.isFinite(numericValue) ? numericValue : 0,
                0,
                1
            );
        }
    };

    /* ==========================================================
       ANIMATION
    ========================================================== */

    function render() {
        if (!running) {
            return;
        }

        const time = clock.getElapsedTime();

        if (model) {
            clickPulse = Math.max(
                0,
                clickPulse - 0.028
            );

            const pulse =
                Math.sin(clickPulse * Math.PI) * 0.13;

            const hoverScale = stage.classList.contains("is-hovered")
                ? 1.05
                : 1;

            const desiredScale =
                baseScale *
                (hoverScale + pulse + audioLevel * 0.08);

            model.rotation.x = THREE.MathUtils.lerp(
                model.rotation.x,
                targetRotation.x + Math.sin(time * 0.72) * 0.035,
                0.06
            );

            model.rotation.y = THREE.MathUtils.lerp(
                model.rotation.y,
                targetRotation.y + time * 0.11,
                0.06
            );

            model.position.y = THREE.MathUtils.lerp(
                model.position.y,
                -0.55 + Math.sin(time * 1.15) * 0.11 + pulse,
                0.06
            );

            desiredScaleVector.setScalar(desiredScale);

            model.scale.lerp(
                desiredScaleVector,
                0.07
            );

            camera.position.z = THREE.MathUtils.lerp(
                camera.position.z,
                7.5 - pulse * 2.6,
                0.08
            );
        }

        renderer.render(scene, camera);
    }

    /*
       Reduced-motion users still see the 3D model, but it does not
       continuously rotate or float.
    */

    if (prefersReducedMotion) {
        running = false;

        const renderOnce = () => {
            renderer.render(scene, camera);
        };

        resizeScene();
        renderOnce();

        const reducedMotionObserver = new MutationObserver(renderOnce);

        reducedMotionObserver.observe(stage, {
            attributes: true,
            childList: true,
            subtree: true
        });
    } else {
        renderer.setAnimationLoop(render);
    }
});
