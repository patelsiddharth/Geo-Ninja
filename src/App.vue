<template>
    <div id="app">
        <Navbar />
        <router-view/>
    </div>
</template>

<script>
import Navbar from './components/Layout/Navbar.vue';
export default {
    name: 'App',
    components: { Navbar },
    data()
    {
        return{
            
        }
    }
}
</script>

<style>
body
{
    background: #ddd;
}
</style>
