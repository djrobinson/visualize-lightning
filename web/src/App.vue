<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">Data</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  p, li {
    font-size: 11px;
  }
}
.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
}

.button {
  background-color: white; 
  color: black; 
  border: 2px solid #4CAF50;
}

.button:hover {
  background-color: #4CAF50;
  color: white;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  position: fixed;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 50px;
  z-index: 5;
  background: rgba(255, 255, 255);
  width: 100%;
  a {
    padding: 10px;
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
