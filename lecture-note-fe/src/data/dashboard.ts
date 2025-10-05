export type Course = {
  id: string
  name: string
}

export type Note = {
  name: string
  type: 'PDF' | 'DOCX' | 'TXT'
  size: string
}

export const courses: Course[] = [
  { id: 'cs101', name: 'Intro to Computer Science' },
  { id: 'phy205', name: 'Quantum Physics' },
  { id: 'his340', name: 'The Roman Empire' },
  { id: 'art100', name: 'Modern Art History' },
  { id: 'math301', name: 'Advanced Calculus' },
]

export const weeks = Array.from({ length: 12 }, (_, i) => ({
  id: `week-${i + 1}`,
  name: `Week ${i + 1}`,
}))

export const MOCK_NOTES_CONTENT = `
Quantum Physics Notes - Week 5

Wave-Particle Duality:
One of the most fundamental concepts in quantum mechanics. It posits that every particle or quantum entity may be described as either a particle or a wave.
- Light can behave as a wave (diffraction, interference) and as a particle (photoelectric effect - photons).
- Louis de Broglie proposed that all matter has wave-like properties. The de Broglie wavelength is given by λ = h/p, where h is Planck's constant and p is the momentum of the particle.
- Experimental evidence: Davisson-Germer experiment showed electron diffraction, confirming their wave nature.

The Schrödinger Equation:
A mathematical equation that describes how the quantum state of a quantum system changes with time.
- Time-dependent Schrödinger equation: iħ(∂/∂t)Ψ(r, t) = ĤΨ(r, t)
- Time-independent Schrödinger equation: Ĥψ(r) = Eψ(r)
Here, Ĥ is the Hamiltonian operator, E is the energy eigenvalue, and ψ is the wavefunction.
The wavefunction, ψ, is a complex-valued probability amplitude. The square of its magnitude, |ψ|², gives the probability density of finding the particle at a given point in space.

Heisenberg's Uncertainty Principle:
It states that there is a fundamental limit to the precision with which certain pairs of physical properties of a particle, known as complementary variables, can be known simultaneously.
- For position (x) and momentum (p): Δx * Δp ≥ ħ/2
- For energy (E) and time (t): ΔE * Δt ≥ ħ/2
This is not a statement about the limitations of our measurement instruments, but an inherent property of quantum systems. The more precisely one property is measured, the less precisely the other can be known.

Quantum Tunneling:
A quantum mechanical phenomenon where a wavefunction can propagate through a potential barrier.
- Classically, a particle without enough energy to surmount a potential barrier would be reflected.
- In quantum mechanics, there is a non-zero probability that the particle can "tunnel" through the barrier and appear on the other side.
- The probability of tunneling decreases exponentially with the thickness and height of the barrier.
- Applications: Tunnel diodes, Scanning Tunneling Microscope (STM), nuclear fusion in stars.
`;
