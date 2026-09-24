"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

/*
 * Monopo'nun <monopo-gradient> yaklaşımına göre: dört renk durağı, geniş
 * anizotropik formlar, tekrarlanan alan ve güçlü domain warp. Siyah bölgeler
 * ayrı bir katman değil; renk alanının doğal negatif boşluklarıdır.
 */
const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uTrail1;
uniform vec2 uTrail2;
uniform vec2 uTrail3;
uniform vec2 uVelocity;
uniform vec2 uColorOffset;
uniform vec2 uPosition;
uniform float uColorSize;
uniform float uColorSpacing;
uniform float uColorRotation;
uniform float uColorSpread;
uniform float uDisplacement;
uniform float uZoom;
uniform float uSpacing;
uniform float uSeed;
uniform float uTime;
uniform float uScroll;
uniform float uActivity;

vec3 hash3(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

float gradientNoise3D(vec3 x) {
  vec3 cell = floor(x);
  vec3 local = fract(x);
  vec3 curve = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);

  vec3 a = hash3(cell + vec3(0.0, 0.0, 0.0)) * 2.0 - 1.0;
  vec3 b = hash3(cell + vec3(1.0, 0.0, 0.0)) * 2.0 - 1.0;
  vec3 c = hash3(cell + vec3(0.0, 1.0, 0.0)) * 2.0 - 1.0;
  vec3 d = hash3(cell + vec3(1.0, 1.0, 0.0)) * 2.0 - 1.0;
  vec3 e = hash3(cell + vec3(0.0, 0.0, 1.0)) * 2.0 - 1.0;
  vec3 f = hash3(cell + vec3(1.0, 0.0, 1.0)) * 2.0 - 1.0;
  vec3 g = hash3(cell + vec3(0.0, 1.0, 1.0)) * 2.0 - 1.0;
  vec3 h = hash3(cell + vec3(1.0, 1.0, 1.0)) * 2.0 - 1.0;

  float va = dot(a, local - vec3(0.0, 0.0, 0.0));
  float vb = dot(b, local - vec3(1.0, 0.0, 0.0));
  float vc = dot(c, local - vec3(0.0, 1.0, 0.0));
  float vd = dot(d, local - vec3(1.0, 1.0, 0.0));
  float ve = dot(e, local - vec3(0.0, 0.0, 1.0));
  float vf = dot(f, local - vec3(1.0, 0.0, 1.0));
  float vg = dot(g, local - vec3(0.0, 1.0, 1.0));
  float vh = dot(h, local - vec3(1.0, 1.0, 1.0));

  return va
    + curve.x * (vb - va)
    + curve.y * (vc - va)
    + curve.z * (ve - va)
    + curve.x * curve.y * (va - vb - vc + vd)
    + curve.y * curve.z * (va - vc - ve + vg)
    + curve.z * curve.x * (va - vb - ve + vf)
    + curve.x * curve.y * curve.z * (-va + vb + vc - vd + ve - vf - vg + vh);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

vec2 flowWarp(vec2 point, vec2 center, float direction, float strength) {
  vec2 delta = point - center;
  float radius = length(delta);
  float influence = exp(-dot(delta, delta) * 2.65) * strength;
  vec2 tangent = vec2(-delta.y, delta.x);
  float ripple = sin(radius * 11.0 - uTime * 0.13) * 0.10;

  // Teğetsel kuvvet alanı kıvırır; radyal kuvvet katmanı açıp kapatır.
  return tangent * direction * influence * (0.72 + ripple)
    - delta * influence * (0.24 + ripple * 0.35);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 screen = vUv;
  screen.x *= aspect;

  vec2 pointer = vec2(uPointer.x * aspect, uPointer.y);
  vec2 trail1 = vec2(uTrail1.x * aspect, uTrail1.y);
  vec2 trail2 = vec2(uTrail2.x * aspect, uTrail2.y);
  vec2 trail3 = vec2(uTrail3.x * aspect, uTrail3.y);
  vec2 velocity = vec2(uVelocity.x * aspect, uVelocity.y);

  // Mouse hareketi tek bir öteleme değil, gecikmeli dört kuvvet merkezi.
  // Merkezler zıt yönlerde döner; hareket sırasında renk alanı kollara
  // ayrılır, activity düşünce deformasyon sıfırlanıp tekrar birleşir.
  float mouseForce = uActivity;
  screen += flowWarp(screen, pointer, 1.0, mouseForce * 1.00);
  screen += flowWarp(screen, trail1, -1.0, mouseForce * 0.82);
  screen += flowWarp(screen, trail2, 1.0, mouseForce * 0.62);
  screen += flowWarp(screen, trail3, -1.0, mouseForce * 0.44);

  vec2 pointerDelta = screen - pointer;
  float wake = exp(-dot(pointerDelta, pointerDelta) * 3.8) * mouseForce;
  screen -= velocity * wake * 1.35;
  screen.y += sin(pointerDelta.x * 8.0 + uTime * 0.18) * wake * 0.18;

  // Scroll'un ortasında iki karşıt girdap alanı böler. Eller buluşmaya
  // yaklaşırken splitPhase tekrar sıfıra iner ve alan tek parçaya kapanır.
  float splitPhase = sin(clamp(uScroll, 0.0, 1.0) * 3.14159265);
  vec2 meetingScreen = vec2(0.0, 0.05);
  vec2 leftFlow = mix(vec2(-1.08, 0.58), meetingScreen, uScroll);
  vec2 rightFlow = mix(vec2(1.08, -0.52), meetingScreen, uScroll);
  screen += flowWarp(screen, leftFlow, 1.0, splitPhase * 0.76);
  screen += flowWarp(screen, rightFlow, -1.0, splitPhase * 0.76);

  vec2 position = screen / uZoom + uPosition;
  vec2 noisePosition = position * 0.5 + 0.5;
  float displacement = gradientNoise3D(vec3(noisePosition, uSeed));

  // Scroll ilerledikçe alan parmakların buluşma noktasına doğru bükülür.
  vec2 meetingPoint = vec2(0.0, 0.05);
  vec2 meetingDelta = position - meetingPoint;
  float meetingInfluence = exp(-dot(meetingDelta, meetingDelta) * 0.72) * uScroll;
  position -= meetingDelta * meetingInfluence * 0.16;
  position += vec2(displacement, displacement * 0.72) * uDisplacement;

  vec2 colorPosition = position - uColorOffset;
  colorPosition = mod(colorPosition - uSpacing, vec2(uSpacing * 2.0)) - uSpacing;
  colorPosition = rotate2d(-uColorRotation) * colorPosition;
  colorPosition /= vec2(uColorSize);
  colorPosition *= vec2(1.0 / uColorSpread, 1.0);

  vec3 color = vec3(0.0);
  color = mix(
    uColor1,
    color,
    smoothstep(0.0, 1.0, distance(colorPosition, vec2(0.0, uColorSpacing * 1.5)))
  );
  color = mix(
    uColor2,
    color,
    smoothstep(0.0, 1.0, distance(colorPosition, vec2(0.0, uColorSpacing * 0.5)))
  );
  color = mix(
    uColor3,
    color,
    smoothstep(0.0, 1.0, distance(colorPosition, vec2(0.0, -uColorSpacing * 0.5)))
  );
  color = mix(
    uColor4,
    color,
    smoothstep(0.0, 1.0, distance(colorPosition, vec2(0.0, -uColorSpacing * 1.5)))
  );

  float grain = hash21(gl_FragCoord.xy + fract(uTime) * 733.0) - 0.5;
  color += grain * 0.052;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

type HeroFieldProps = {
  scrollProgress: MotionValue<number>;
};

const COLORS = {
  wine: [0.27, 0.018, 0.12],
  pink: [0.86, 0.075, 0.40],
  blush: [0.98, 0.44, 0.63],
  coral: [1.0, 0.23, 0.10],
};

/* WebGL yoksa, shader derlenemezse ya da bağlam kaybolursa görünen statik
   yedek. Shader'ın paletine ve genel kompozisyonuna yakın tutuldu. */
const FALLBACK_BACKGROUND = [
  "radial-gradient(ellipse 60% 55% at 22% 30%, rgba(250,112,161,0.55), transparent 70%)",
  "radial-gradient(ellipse 55% 60% at 78% 62%, rgba(255,59,26,0.45), transparent 70%)",
  "radial-gradient(ellipse 70% 70% at 55% 40%, rgba(219,19,102,0.55), transparent 75%)",
  "linear-gradient(160deg, #45041f 0%, #0A0308 70%)",
].join(", ");

export default function HeroField({ scrollProgress }: HeroFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* Canvas yalnızca ilk kare başarıyla çizildikten sonra görünür olur;
     o zamana kadar (ve hata durumunda) yedek degrade görünür. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
      setReady(false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("WebGL shader oluşturulamadı.");

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) ?? "Shader derlenemedi.";
        gl.deleteShader(shader);
        throw new Error(message);
      }

      return shader;
    };

    let vertexShader: WebGLShader;
    let fragmentShader: WebGLShader;
    let program: WebGLProgram | null;
    try {
      vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      program = gl.createProgram();
      if (!program) throw new Error("WebGL programı oluşturulamadı.");
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "WebGL programı bağlanamadı.");
      }
    } catch (error) {
      // Yedek degrade görünür kalır; hero kırılmaz.
      console.warn("[HeroField] WebGL devre dışı, statik yedek kullanılıyor:", error);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const positionAttribute = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    [
      "uColor1",
      "uColor2",
      "uColor3",
      "uColor4",
      "uResolution",
      "uPointer",
      "uTrail1",
      "uTrail2",
      "uTrail3",
      "uVelocity",
      "uColorOffset",
      "uPosition",
      "uColorSize",
      "uColorSpacing",
      "uColorRotation",
      "uColorSpread",
      "uDisplacement",
      "uZoom",
      "uSpacing",
      "uSeed",
      "uTime",
      "uScroll",
      "uActivity",
    ].forEach((name) => {
      uniforms[name] = gl.getUniformLocation(program, name);
    });

    // Referansın renk sırası korunuyor; tonlar Zeplin paletine çekiliyor.
    gl.uniform3fv(uniforms.uColor1, COLORS.wine);
    gl.uniform3fv(uniforms.uColor2, COLORS.pink);
    gl.uniform3fv(uniforms.uColor3, COLORS.blush);
    gl.uniform3fv(uniforms.uColor4, COLORS.coral);
    gl.uniform1f(uniforms.uColorSize, 0.82);
    gl.uniform1f(uniforms.uColorSpacing, 0.52);
    gl.uniform1f(uniforms.uColorSpread, 4.52);
    gl.uniform1f(uniforms.uSpacing, 4.27);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targetPointer = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    const trail1 = { x: 0, y: 0 };
    const trail2 = { x: 0, y: 0 };
    const trail3 = { x: 0, y: 0 };
    const targetVelocity = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let targetActivity = 0;
    let activity = 0;
    let scroll = scrollProgress.get();
    let animationFrame = 0;
    let lastFrame = performance.now();
    let elapsed = 0;
    let isVisible = true;

    const resize = () => {
      const maxDpr = window.innerWidth < 768 ? 1.2 : 1.4;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);

      if (!width || !height || (canvas.width === width && canvas.height === height)) {
        return;
      }

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const draw = () => {
      resize();
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y);
      gl.uniform2f(uniforms.uTrail1, trail1.x, trail1.y);
      gl.uniform2f(uniforms.uTrail2, trail2.x, trail2.y);
      gl.uniform2f(uniforms.uTrail3, trail3.x, trail3.y);
      gl.uniform2f(uniforms.uVelocity, velocity.x, velocity.y);
      gl.uniform2f(
        uniforms.uColorOffset,
        -0.57,
        -0.18 + scroll * 0.05
      );
      gl.uniform2f(
        uniforms.uPosition,
        -0.20,
        -0.34 + scroll * 0.06
      );
      gl.uniform1f(
        uniforms.uColorRotation,
        -0.38 + scroll * 0.12
      );
      gl.uniform1f(
        uniforms.uDisplacement,
        4.66 + activity * 0.48 + scroll * 0.50
      );
      gl.uniform1f(uniforms.uZoom, 0.79 + scroll * 0.04);
      gl.uniform1f(
        uniforms.uSeed,
        -0.06 + elapsed * 0.009 + scroll * 0.11
      );
      gl.uniform1f(uniforms.uTime, elapsed * 0.62);
      gl.uniform1f(uniforms.uScroll, scroll);
      gl.uniform1f(uniforms.uActivity, activity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = 1 - (event.clientY / window.innerHeight) * 2;
      const deltaX = x - targetPointer.x;
      const deltaY = y - targetPointer.y;
      targetVelocity.x = Math.max(-0.28, Math.min(0.28, deltaX * 2.6));
      targetVelocity.y = Math.max(-0.28, Math.min(0.28, deltaY * 2.6));
      targetActivity = Math.max(
        targetActivity,
        Math.min(1, Math.hypot(deltaX, deltaY) * 5.5)
      );
      targetPointer.x = x;
      targetPointer.y = y;
    };

    const frame = (now: number) => {
      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      elapsed += delta;

      const pointerFollow = Math.min(delta * 4.8, 1);
      const trail1Follow = Math.min(delta * 3.0, 1);
      const trail2Follow = Math.min(delta * 1.9, 1);
      const trail3Follow = Math.min(delta * 1.2, 1);
      const velocityFollow = Math.min(delta * 7.0, 1);
      const activityFollow = Math.min(delta * (targetActivity > activity ? 9.0 : 2.0), 1);

      pointer.x += (targetPointer.x - pointer.x) * pointerFollow;
      pointer.y += (targetPointer.y - pointer.y) * pointerFollow;
      trail1.x += (pointer.x - trail1.x) * trail1Follow;
      trail1.y += (pointer.y - trail1.y) * trail1Follow;
      trail2.x += (trail1.x - trail2.x) * trail2Follow;
      trail2.y += (trail1.y - trail2.y) * trail2Follow;
      trail3.x += (trail2.x - trail3.x) * trail3Follow;
      trail3.y += (trail2.y - trail3.y) * trail3Follow;
      velocity.x += (targetVelocity.x - velocity.x) * velocityFollow;
      velocity.y += (targetVelocity.y - velocity.y) * velocityFollow;
      activity += (targetActivity - activity) * activityFollow;

      targetVelocity.x *= Math.max(0, 1 - delta * 6.5);
      targetVelocity.y *= Math.max(0, 1 - delta * 6.5);
      targetActivity *= Math.max(0, 1 - delta * 1.8);
      draw();
      animationFrame = requestAnimationFrame(frame);
    };

    /* Döngü yalnızca hero görünür ve sekme öndeyken çalışır; azaltılmış
       hareket tercihinde hiç başlamaz (tek kare çizilir). */
    let running = false;
    function start() {
      if (running || prefersReducedMotion || document.hidden || !isVisible) return;
      running = true;
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(animationFrame);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      },
      { rootMargin: "160px" }
    );
    visibilityObserver.observe(canvas);

    const onVisibilityChange = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibilityChange);

    const unsubscribeScroll = scrollProgress.on("change", (value) => {
      scroll = value;
    });

    if (!prefersReducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    resize();
    draw();
    setReady(true);
    start();

    return () => {
      stop();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      unsubscribeScroll();
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [scrollProgress]);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: FALLBACK_BACKGROUND }} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}
