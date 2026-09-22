import fs from 'node:fs';

// Original 24-second ambient loop for the 36.5도씨 portfolio.
const sampleRate = 32000;
const duration = 24;
const frameCount = sampleRate * duration;
const left = new Float32Array(frameCount);
const right = new Float32Array(frameCount);
const midiFrequency = note => 440 * 2 ** ((note - 69) / 12);

function addNote(start, length, note, volume, voice, pan = 0) {
  const first = Math.round(start * sampleRate);
  const count = Math.min(Math.round(length * sampleRate), frameCount - first);
  const frequency = midiFrequency(note);
  const leftGain = (1 - pan) / 2;
  const rightGain = (1 + pan) / 2;

  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    const phase = 2 * Math.PI * frequency * t;
    let envelope;
    let wave;

    if (voice === 'pad') {
      envelope = Math.min(1, t / .25) * Math.min(1, (length - t) / .48);
      envelope *= .83 + .17 * Math.sin(2 * Math.PI * .32 * t);
      wave = .68 * Math.sin(phase) + .2 * Math.sin(phase * .998) + .12 * Math.sin(phase * 2);
    } else if (voice === 'bass') {
      envelope = Math.min(1, t / .05) * Math.min(1, (length - t) / .25);
      wave = .88 * Math.sin(phase) + .12 * Math.sin(phase * 2);
    } else if (voice === 'bell') {
      envelope = Math.min(1, t / .008) * Math.exp(-2.8 * t);
      wave = .75 * Math.sin(phase) + .25 * Math.sin(phase * 2.01);
    } else {
      envelope = Math.min(1, t / .012) * Math.exp(-2.1 * t);
      wave = .7 * Math.sin(phase) + .23 * Math.sin(phase * 2) + .07 * Math.sin(phase * 3);
    }

    const sample = wave * envelope * volume;
    left[first + i] += sample * leftGain;
    right[first + i] += sample * rightGain;
  }
}

// 80 BPM, eight three-second bars: Cmaj9 · Am9 · Fmaj9 · G6sus2, twice.
const chords = [
  { root: 36, notes: [48, 52, 55, 59, 62] },
  { root: 33, notes: [45, 48, 52, 55, 59] },
  { root: 41, notes: [53, 57, 60, 64, 67] },
  { root: 43, notes: [55, 57, 62, 64, 67] },
];
const arpeggio = [0, 2, 1, 3, 2, 1, 4, 2];

for (let bar = 0; bar < 8; bar++) {
  const chord = chords[bar % 4];
  const start = bar * 3;
  addNote(start, 2.92, chord.root, .19, 'bass');
  chord.notes.slice(0, 4).forEach((note, index) => {
    addNote(start, 2.9, note, .13, 'pad', (index - 1.5) * .2);
  });
  arpeggio.forEach((index, step) => {
    addNote(start + step * .375, .82, chord.notes[index] + (bar >= 4 && step === 6 ? 12 : 0), .095, 'pluck', (step % 2 ? .35 : -.35));
  });
  addNote(start + 1.5, 1.1, chord.notes[3] + 12, .055, 'bell', .35);
}

// Small stereo echoes add space without a loud beat.
const dryLeft = left.slice();
const dryRight = right.slice();
const delays = [[.23, .13], [.41, .08]];
for (const [seconds, gain] of delays) {
  const offset = Math.round(seconds * sampleRate);
  for (let i = offset; i < frameCount; i++) {
    left[i] += dryRight[i - offset] * gain;
    right[i] += dryLeft[i - offset] * gain;
  }
}

let peak = 0;
for (let i = 0; i < frameCount; i++) {
  const edge = Math.min(1, i / (sampleRate * .5), (frameCount - 1 - i) / (sampleRate * .7));
  left[i] *= edge;
  right[i] *= edge;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}

const scale = .8 / Math.max(peak, .8);
const dataBytes = frameCount * 4;
const wav = Buffer.alloc(44 + dataBytes);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + dataBytes, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(dataBytes, 40);
for (let i = 0; i < frameCount; i++) {
  wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i] * scale)) * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i] * scale)) * 32767), 46 + i * 4);
}

const output = new URL('./dist/assets/blue-warmth-loop.wav', import.meta.url);
fs.writeFileSync(output, wav);
console.log(`Created ${duration}s stereo loop (${wav.length} bytes): ${output.pathname}`);
