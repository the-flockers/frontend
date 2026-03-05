<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/learn" class="nav-link">Learn</router-link>
      <router-link to="/news" class="nav-link">News</router-link>
      <router-link to="/get-involved" class="nav-link">Get Involved</router-link>
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
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #42b883;
}

.nav-link.router-link-active {
  color: #42b883;
  font-weight: 600;
}
</style>
