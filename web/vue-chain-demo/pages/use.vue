<template>
    <section class="home-page">
        <page1></page1>
        <page2></page2>
        <page3></page3>
    </section>
</template>

<script>
    import page1 from '~/components/home/page-1.vue';
    import page2 from '~/components/home/page-2.vue';
    import page3 from '~/components/home/page-3.vue';
    export default {
        components: {
            page1, page2, page3
        }
    }
</script>
