<template>
    <section class="buy-page">
        <page1></page1>
        <page2></page2>
    </section>
</template>

<script>
    import page1 from '~/components/buy/page-1.vue';
    import page2 from '~/components/buy/page-2.vue';
    export default {
        components: {
            page1, page2
        }
    }
</script>
