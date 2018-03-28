<template>
    <div class="dashboard">
        <div class="row">
            <div class="col-xs-12">
                <div class="dash-message-bar">
                    <span>Hello {{currentUser.firstName}} {{currentUser.lastName}}, here you may post your own keeps, manage your
                        vaults, and be awesome!</span>
                </div>
            </div>
            <div class="col-xs-12">
                <div class="panel panel-default">
                    <div class="panel-heading dash-heading">
                        <span>My Dashboard</span>
                        <span></span>
                        <div class="dash-buttons">
                            <span @click="makeVaultKeep('keep')" class="hand-cursor active-button dash-button fa fa-xing" v-if="makingKeep"></span>
                            <span @click="makeVaultKeep('keep')" class="hand-cursor dash-button fa fa-xing" v-else></span>
                            <span @click="makeVaultKeep('vault')" class="hand-cursor active-button dash-button fa fa-vimeo" v-if="makingVault"></span>
                            <span @click="makeVaultKeep('vault')" class="hand-cursor dash-button fa fa-vimeo" v-else></span>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div class="submit-form" v-if="makingKeep">
                            <h3>Create New Keep</h3>
                            <form class="form" @submit.prevent="submitKeep">
                                <div class="form-group">
                                    <input class="form-control" type="text" name="name" placeholder="Name" v-model='makeKeep.name' maxlength="20" required>
                                </div>
                                <div class="form-group">
                                    <input class="form-control" type="" name="description" placeholder="Description" v-model='makeKeep.description' maxlength="255"
                                        required>
                                </div>
                                <div class="form-group">
                                    <input class="form-control" type="url" name="imageurl" placeholder="Image URL" v-model='makeKeep.imageUrl' maxlength="255"
                                        required>
                                </div>
                                <div class="form-group">
                                    <label for="public">Mark as Public?</label>
                                    <input type="checkbox" name="public" v-model='makeKeep.public'>
                                </div>
                                <div class="form-group">
                                    <button type="submit" class="pink-button wide-button pull-left management-button">Create Keep</button>
                                    <button class="grey-button center-button pull-left management-button" data-toggle="modal" data-target="#keepManageModal">Manage Keeps</button>
                                    <button @click="resetForms" class="purple-button wide-button pull-right management-button">Reset</button>
                                </div>
                            </form>
                        </div>
                        <div class="submit-form" v-if="makingVault">
                            <h3>Create New Vault</h3>
                            <form class="form" @submit.prevent="submitVault">
                                <div class="form-group">
                                    <input class="form-control" type="text" name="name" placeholder="Name" v-model='makeVault.name' maxlength="20" required>
                                </div>
                                <div class="form-group">
                                    <input class="form-control" type="" name="description" placeholder="Description" v-model='makeVault.description' maxlength="255"
                                        required>
                                </div>
                                <div class="form-group">
                                    <button type="submit" class="pink-button wide-button pull-left management-button">Create Vault</button>
                                    <button class="grey-button center-button pull-left management-button" data-toggle="modal" data-target="#vaultManageModal">Manage Vaults</button>
                                    <button @click="resetForms" class="purple-button wide-button pull-right management-button">Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <!-- VAULT MANAGEMENT MODAL -->
        <div class="modal fade" id="vaultManageModal" tabindex="-1" role="dialog" aria-labelledby="vaultManageModalLabel">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title">Vault Manager</h4>
                    </div>
                    <div class="modal-body max-height-80vh">
                        <div class="row">
                            <div class="col-xs-5 col-xs-offset-1">
                                <div class="row flex flex-column">
                                    <div class="col-xs-12" v-for="vault in userVaults">
                                        <div class="row flex">
                                            <div @click="setCurrentVaultAndKeeps(vault)" class="height-100 text-center vault-manager-title-div">
                                                <span class="manager-title">{{vault.name}}</span>
                                            </div>
                                            <!-- <div class="col-xs-7 height-100 text-center manager-title-div">
                                                <span class="manager-title">{{vault.description}}</span>
                                            </div> -->
                                            <div class="hand-cursor height-100 text-center manager-controls-div">
                                                <i @click="removeVault(vault)" class="fa fa-ban manager-controls"></i>
                                                <!-- <i class="fa fa-arrow-circle-o-up manager-controls"></i> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-5">
                                <div class="row flex flex-column">
                                    <div class="col-xs-12 vault-keep-row" v-for="(keep, i) in currentVaultKeeps" v-if="currentVaultKeeps.length > 0">
                                        <div class="row flex">
                                            <div class="flex vault-keep-entry vault-keep-entry-thumb">
                                                <img :src="keep.imageUrl" :alt="keep.name">
                                            </div>
                                            <div class="flex vault-keep-entry vault-keep-entry-name grey" v-if="i % 2 == 0">
                                                <span>{{keep.name}}</span>
                                            </div>
                                            <div class="flex vault-keep-entry vault-keep-entry-name" v-else>
                                                <span>{{keep.name}}</span>
                                            </div>
                                            <div class="flex hand-cursor text-center vault-keep-entry vault-keep-entry-controls grey" v-if="i % 2 == 0">
                                                <i @click="removeKeepFromVault(keep)" class="fa fa-ban"></i>
                                            </div>
                                            <div class="flex hand-cursor text-center vault-keep-entry vault-keep-entry-controls" v-else>
                                                <i @click="removeKeepFromVault(keep)" class="fa fa-ban"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div> -->
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <!-- /.modal -->
        <!-- VAULT MANAGEMENT MODAL END -->


        <!-- KEEP MANAGEMENT MODAL -->
        <div class="modal fade" id="keepManageModal" tabindex="-1" role="dialog" aria-labelledby="keepManageModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title">Keep Manager</h4>
                    </div>
                    <div class="modal-body max-height-80vh">
                        <div class="row">
                            <div class="col-xs-12 text-center">
                                <h5 class="column-title">Keeps:</h5>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-10 col-xs-offset-1" v-for="keep in userKeeps">
                                <div class="row flex">
                                    <div class="height-100 text-center manager-thumb-div">
                                        <img class="manager-thumb" :src="keep.imageUrl" :alt="keep.name">
                                    </div>
                                    <div class="height-100 text-center manager-title-div">
                                        <span class="manager-title">{{keep.name}}</span>
                                    </div>
                                    <div class="hand-cursor height-100 text-center manager-controls-div">
                                        <!-- <i @click="removeKeep(keep)" class="fa fa-ban manager-controls"></i> -->
                                        <i @click="togglePublic(keep)" class="fa fa-lock manager-controls" v-if="!keep.public"></i>
                                        <i @click="togglePublic(keep)" class="fa fa-unlock manager-controls" v-else></i>
                                    </div>
                                    <div class="hand-cursor height-100 text-center manager-controls-div">
                                        <i @click="removeKeep(keep)" class="fa fa-ban manager-controls"></i>
                                        <!-- <i class="fa fa-arrow-circle-o-up manager-controls"></i> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div> -->
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
    <!-- KEEP MANAGEMENT MODAL END -->









    </div>
</template>

<script>
    export default {
        name: 'Dashboard',
        data() {
            return {
                makingVault: false,
                makingKeep: true,
                makeKeep: {
                    userId: 0,
                    name: '',
                    description: '',
                    imageUrl: '',
                    views: 0,
                    keeps: 0,
                    shares: 0,
                    public: false
                },
                makeVault: {
                    userId: 0,
                    name: '',
                    description: ''
                }
            }
        },
        mounted() {
            this.$store.dispatch('authenticate')
            $('#vaultManageModal').on('hide.bs.modal', () => {
                this.$store.dispatch('setCurrentVault', {})
                this.$store.dispatch('getKeepsInVault', false)
            })
        },
        beforeDestroy() {
            $('#vaultManageModal').off('hide.bs.modal')
        },
        methods: {
            resetForms() {
                this.makeKeep = {
                    userId: 0,
                    name: '',
                    description: '',
                    imageUrl: '',
                    views: 0,
                    keeps: 0,
                    shares: 0,
                    public: false
                },
                    this.makeVault = {
                        userId: 0,
                        name: '',
                        description: ''
                    }
            },
            makeVaultKeep(vaultOrKeep) {
                if (vaultOrKeep == "keep") {
                    this.makingVault = false
                    this.makingKeep = true
                } else if (vaultOrKeep == "vault") {
                    this.makingVault = true
                    this.makingKeep = false
                }
            },
            submitKeep() {
                this.makeKeep.userId = this.currentUser._id
                this.$store.dispatch('submitKeep', { currentUser: this.currentUser, keep: this.makeKeep })
                this.resetForms()
            },
            removeKeep(keep) {
                this.$store.dispatch('removeKeep', { currentUser: this.currentUser, keep: keep })
            },
            submitVault() {
                this.makeVault.userId = this.currentUser._id
                this.$store.dispatch('submitVault', { currentUser: this.currentUser, vault: this.makeVault })
                // this.$store.dispatch('getUserVaults', this.currentUser._id)
                this.resetForms()
            },
            removeVault(vault) {
                this.$store.dispatch('removeVault', { currentUser: this.currentUser, vault: vault })
            },
            removeKeepFromVault(keep) {
                this.$store.dispatch('removeKeepFromVault', { currentUser: this.currentUser, currentVault: this.currentVault, keep: keep })
            },
            setCurrentVaultAndKeeps(vault) {
                this.$store.dispatch('setCurrentVault', vault)
                this.$store.dispatch('getKeepsInVault', vault._id)
            },
            togglePublic(keep) {
                this.$store.dispatch('togglePublic', { currentUser: this.currentUser, keep: keep })
            }
        },
        computed: {
            currentUser() {
                return this.$store.state.currentUser
            },
            userKeeps() {
                return this.$store.state.userKeeps
            },
            userVaults() {
                return this.$store.state.userVaults
            },
            currentVault() {
                return this.$store.state.currentVault
            },
            currentVaultKeeps() {
                return this.$store.state.currentVaultKeeps
            }
        },
        components: {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .dash-message-bar {
        margin: auto;
        background-color: #9854bb;
        color: #ffffff;
        font-size: 1.25em;
        padding: .75em;
        margin-bottom: 20px;
    }

    .panel-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }

    @media screen and (max-width: 380px) {
        .panel-heading {
            flex-direction: column;
        }
    }

    .dash-heading {
        font-size: 2.5em;
        color: #52525c
    }

    .dash-buttons {
        display: flex;
    }

    .dash-button {
        font-size: .5em;
        background-color: #fd0090;
        color: #ffffff;
        padding: 10px;
        margin: 5px;
        outline: 2px solid #fd0090;
    }

    .management-button {
        font-size: 1.5vw;
    }

    @media screen and (max-width: 600px) {
        .management-button {
            font-size: 2.5vw;
        }
    }

    @media screen and (min-width: 1600px) {
        .management-button {
            font-size: 1.25vw;
        }
    }

    .active-button {
        outline: 2px solid #9854bb;
        color: #fd0090;
        background-color: #ffffff;
    }

    .pink-button {
        background-color: #fd0090;
        outline: 1px solid #fd0090;
        border: none;
        color: #ffffff;
        padding: 5px 10px 5px 10px;
    }

    .purple-button {
        background-color: #9854bb;
        outline: 1px solid #9854bb;
        border: none;
        color: #ffffff;
        padding: 5px 10px 5px 10px;
    }

    .grey-button {
        background-color: #F5F5F4;
        outline: 1px solid #F5F5F4;
        border: none;
        color: #000000;
        padding: 5px 10px 5px 10px;
    }

    .wide-button {
        width: 33%;
        height: 40px;
    }

    .center-button {
        width: 34%;
        height: 40px;
    }

    .submit-form {
        width: 75%;
        margin: auto;
    }

    .panel {
        border-radius: 0;
    }

    .flex {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .flex-column {
        flex-direction: column;
    }

    .manager-thumb-div {
        outline: 1px solid #000000;
        background-color: #fd0090;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 25%;
    }

    .vault-manager-title-div {
        outline: 1px solid #000000;
        background-color: #fd0090;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 90%;
    }

    .manager-thumb {
        max-height: 85%;
        max-width: 85%;
    }

    .manager-title-div {
        outline: 1px solid #000000;
        background-color: #9854bb;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 55%;
    }

    .manager-title {
        font-size: 5vw;
        color: #ffffff;
    }

    @media screen and (min-width: 800px) {
        .manager-title {
            font-size: 2.5vw;
        }
    }

    @media screen and (min-width: 1200px) {
        .manager-title {
            font-size: 1.75vw;
        }
    }

    @media screen and (min-width: 2000px) {
        .manager-title {
            font-size: 1.5vw;
        }
    }

    .manager-controls-div {
        outline: 1px solid #000000;
        background-color: #F5F5F4;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 10%;
    }

    .manager-controls {
        font-size: 1.5vw;
        color: #000000;
    }

    @media screen and (max-width: 700px) {
        .manager-controls {
            font-size: 5vw;
        }
    }

    @media screen and (max-width: 1000px) {
        .manager-controls {
            font-size: 2.5vw;
        }
    }


    @media screen and (max-width: 1500px) {
        .manager-controls {
            font-size: 2.5vw;
        }
    }

    .height-100 {
        height: 100px;
    }

    .max-height-80vh {
        max-height: 80vh;
        overflow: auto;
    }

    .vault-keep-row{
        margin-left: 5px;
    }

    .vault-keep-entry {
        /* font-size: 1.25em; */
        height: 50px;
    }

    .vault-keep-entry-thumb {
        flex-basis: 25%;
        background-color: #9854bb;
    }

    .vault-keep-entry-thumb img {
        max-width: 85%;
        max-height: 85%;
    }

    .vault-keep-entry-name {
        flex-basis: 65%;
    }

    @media screen and (max-width: 400px){
        .vault-keep-entry-name{
            font-size: 1rem;
        }
    }

    @media screen and (min-width: 1200px){
        .vault-keep-entry-name{
            font-size: 2rem;
        }
    }

    .vault-keep-entry-controls {
        flex-basis: 10%;
    }

    .grey {
        background-color: #F5F5F4;
        color: #000000;
    }
</style>