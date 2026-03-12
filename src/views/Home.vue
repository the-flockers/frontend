<template>
  <main class="home">
    <section class="hero section-block">
      <p class="eyebrow">DeFlock San Diego</p>
      <h1>Tracking the spread of ALPR surveillance</h1>
      <p class="hero-copy">
        We map Automatic License Plate Reader (ALPR) infrastructure and document how
        it impacts privacy, movement, and civil liberties.
      </p>

      <div class="counter-wrap" aria-live="polite" aria-atomic="true">
        <span class="counter-label">Cameras mapped</span>
        <p class="counter-value">{{ animatedCount.toLocaleString() }}</p>
      </div>
    </section>

    <section class="section-block scanner">
      <h2>ALPR Scanner</h2>
      <p>
        We are currently developing open-source software which can easily be run
        on the ESP32 microcontroller to scan for ALPRs. This scanning is done via BLE
        identification of ALPR hardware signatures. This has already been implemented by other groups
        (such as by <a href="https://github.com/colonelpanichacks/flock-you">colonelpanichacks</a>),
        but we're a small group developing this project for fun.
      </p>
      <p>
        See our project: <a href="https://github.com/the-flockers/fock-flock">fock-flock</a>.
      </p>
    </section>

    <section class="section-block">
      <h2>Why ALPRs Matter</h2>
      <p>
        ALPR systems, in their current and future standing, are systems explicitly intended
        for mass surveillance. That is, their intention is to track the movement of people
        throughout America to aid in the development of a technofascist surveillance state.
      </p>
      <p>
        Without fighting back, we allow these oppressive force to proliferate and limit our
        freedoms. It's high time to resist this bipartisan, authoritarian push.
      </p>
    </section>

    <section class="section-block incidents">
      <h2>Documented ALPR Incidents</h2>
      <p class="section-intro">
        A growing list of documented incidents, reporting, and legal concerns.
      </p>

      <ul class="incident-list">
        <li v-for="incident in incidents" :key="incident.id" class="incident-item">
          <h3><i>{{ incident.title }}</i></h3>
          <p>{{ incident.summary }}</p>
          <a :href="incident.url" target="_blank" rel="noopener noreferrer">
            Read source
          </a>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const targetCount = 0
const animatedCount = ref(0)

const incidents = [
  {
    id: 1,
    title: 'Flock ALPRs used to surveil activists, protestors',
    summary:
      'Investigations have shown that plate data can be shared broadly, often beyond the community where it was collected.',
    url: 'https://www.eff.org/deeplinks/2025/11/how-cops-are-using-flock-safetys-alpr-network-surveil-protesters-and-activists'
  },
]

let rafId = null

onMounted(() => {
  const duration = 1500
  const start = performance.now()

  const tick = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)

    // Ease out for a fast start and smooth finish
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedCount.value = Math.floor(eased * targetCount)

    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      animatedCount.value = targetCount
    }
  }

  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
:root,
.home {
  --bg: #181818;
  --surface: #141414;
  --surface-2: #1a1a1a;
  --text: #d2d2d2;
  --muted: #9a9a9a;
  --border: #262626;
  --accent: #f0f0f0;
}

.home {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  background: var(--bg);
  color: var(--text);
  font-family: ;
  line-height: 1.6;
}

.section-block {
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

h1,
h2,
h3 {
  line-height: 1.2;
  margin: 0.4rem 0 0.75rem;
}

.hero-copy,
.section-intro,
p {
  margin: 0 0 0.85rem;
}

.counter-wrap {
  margin-top: 1rem;
  border-top: 1px solid var(--border);
  padding-top: 0.85rem;
}

.counter-label {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.counter-value {
  margin: 0;
  font-weight: 800;
  font-size: clamp(2rem, 7vw, 4rem);
  letter-spacing: 0.01em;
}

.scanner ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
}

.incident-list {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
}

.incident-item {
  border-top: 1px solid var(--border);
  padding: 0.9rem 0;
  transition: background-color 0.2s ease;
}

.incident-item:hover {
  background-color: var(--border);
  transition: background-color 0.2s ease;
}


.incident-item:first-child {
  border-top: none;
  padding-top: 0.25rem;
}

.incident-item a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .home {
    padding: 1rem 0.75rem 2rem;
  }

  .section-block {
    padding: 1rem;
  }
}
</style>
