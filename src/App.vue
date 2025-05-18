<template>
  <div class="app-container">
    <header class="app-header">
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/products">Products</router-link>
        <router-link to="/cart">Cart</router-link>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  padding: 1rem;
  background-color: #f5f5f5;
  margin-bottom: 2rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

nav a.router-link-active {
  color: #42b983;
}
</style>
