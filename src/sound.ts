// 주문 벨 소리: 할리갈리 벨처럼 "띵!" 하고 맑게 울리는 소리를 Web Audio 로 합성한다 (음원 파일 없음)
let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx ??= new AC()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** 탁상 벨 한 번: 금속성 배음 몇 개를 빠르게 치고 길게 감쇠시킨다 */
function strike(ac: AudioContext, at: number, volume = 0.5) {
  const base = 2350
  // 작은 금속 종의 비조화 배음 (주파수 배수, 크기, 감쇠 시간)
  const partials: [number, number, number][] = [
    [1, 1, 1.6],
    [2.32, 0.5, 1.0],
    [4.25, 0.28, 0.6],
    [6.63, 0.14, 0.35],
    [0.5, 0.18, 0.9],
  ]
  const out = ac.createGain()
  out.gain.value = volume
  out.connect(ac.destination)

  for (const [mul, amp, decay] of partials) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = base * mul
    // 살짝 떨리는 느낌
    osc.frequency.setValueAtTime(base * mul * 1.004, at)
    osc.frequency.exponentialRampToValueAtTime(base * mul, at + 0.08)
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(amp, at + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay)
    osc.connect(g).connect(out)
    osc.start(at)
    osc.stop(at + decay + 0.05)
  }

  // 손바닥으로 "탁" 치는 짧은 소리
  const len = Math.floor(ac.sampleRate * 0.03)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3
  const noise = ac.createBufferSource()
  const ng = ac.createGain()
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 1800
  ng.gain.value = 0.35
  noise.buffer = buf
  noise.connect(hp).connect(ng).connect(out)
  noise.start(at)
}

/** 주문할 때: 띵! (주방으로 쏙) */
export function playOrderBell() {
  const ac = audio()
  if (!ac) return
  strike(ac, ac.currentTime + 0.01, 0.55)
}

/** 주방에 새 주문이 들어왔을 때: 띵띵! */
export function playKitchenBell() {
  const ac = audio()
  if (!ac) return
  strike(ac, ac.currentTime + 0.01, 0.45)
  strike(ac, ac.currentTime + 0.22, 0.35)
}
