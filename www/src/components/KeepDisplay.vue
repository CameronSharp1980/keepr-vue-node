<template>
    <div class="keep-display">
        <div class="row">
            <div class="keeps-col col-sm-3">
                <div class="row">
                    <div class="col-sm-12" v-for="(keep, i) in keeps[0]" v-if="keep.public">
                        <Keep :keepProp="keep"></Keep>
                    </div>
                </div>
            </div>
            <div class="keeps-col col-sm-3">
                <div class="row">
                    <div class="col-sm-12" v-for="(keep, i) in keeps[1]" v-if="keep.public">
                        <Keep :keepProp="keep"></Keep>
                    </div>
                </div>
            </div>
            <div class="keeps-col col-sm-3">
                <div class="row">
                    <div class="col-sm-12" v-for="(keep, i) in keeps[2]" v-if="keep.public">
                        <Keep :keepProp="keep"></Keep>
                    </div>
                </div>
            </div>
            <div class="keeps-col col-sm-3">
                <div class="row">
                    <div class="col-sm-12" v-for="(keep, i) in keeps[3]" v-if="keep.public">
                        <Keep :keepProp="keep"></Keep>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Keep from './Keep'
    export default {
        name: 'KeepDisplay',
        data() {
            return {

            }
        },
        mounted() {
            this.$store.dispatch('getKeeps')
        },
        methods: {

        },
        computed: {
            keeps() {
                var keepsArr = [[], [], [], []];
                var section = 0;
                var allKeeps = this.$store.state.keeps;
                for (var i = 0; i < allKeeps.length; i++) {
                    if (section > 3) section = 0;
                    keepsArr[section].push(allKeeps[i])
                    section++;
                }
                return keepsArr;
            }
        },
        components: {
            Keep
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .full-width {
        width: 100%;
    }

    .keep-img {
        margin-bottom: 20px;
    }

    .single-keep-div {
        margin: 5px;
    }

    .keep-caption-div {
        font-size: 1em;
        color: #919c9b;
        border-top: 1px solid #f1f1f0;
        /* border-bottom: 1px solid #f1f1f0; */
        width: 90%;
        margin: auto;
        padding: 20px;
    }

    .keep-title {
        font-family: sans-serif;
        font-size: 1.75em;
        font-weight: 100;
    }

    .thumbnail {
        padding: 0;
        border: 1px solid #f1f1f0;
        border-radius: 0;
    }
</style>