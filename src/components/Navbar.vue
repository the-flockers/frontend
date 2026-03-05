<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/" class='logo-link'>
          <img src="@/assets/logo.svg" alt="Logo" class="logo" />
          <span class="logo-text">DeFlock SD</span>
        </router-link>
      </div>

      <div class="nav-right">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/learn" class="nav-link">Learn</router-link>
        <router-link to="/news" class="nav-link">News</router-link>
        <router-link to="/get-involved" class="nav-link">Get Involved</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  background-color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  margin: 0 auto;
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

.logo {
  height: 40px;
  width: auto;
}

.logo-text {
  color: white;
}

.nav-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  background-color: transparent;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-link:hover {
  background-color: rgba(66, 184, 131, 0.1);
  border-color: #42b883;
  color: #42b883;
}

/* For smaller screens */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav-right {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
