<template>
    <div class="logobar-container">
        <div class="logobar">
            <img class="logo" src="../assets/keepr-logo.png" alt="Keepr Logo">
            <span class="user-salutation" v-if="currentUser.username">Hi, {{currentUser.firstName}}</span>

            <div class="logo-buttons">
                <span @click="changeLoginFormState(true)" class="black-button logo-button hand-cursor" type="button" data-toggle="modal" data-target="#signInModal"
                    v-if="!currentUser.username">Sign&nbspin</span>
                <span @click="changeLoginFormState(false)" class="pink-button logo-button hand-cursor" type="button" data-toggle="modal" data-target="#signInModal"
                    v-if="!currentUser.username">Register</span>
                <router-link :to="{ path: '/' }" class="pink-button logo-button router-button" v-if="currentUser.username">View&nbsp;All&nbsp;Keeps</router-link>
                <router-link :to="{ path: 'dashboard' }" class="pink-button logo-button router-button" v-if="currentUser.username">My&nbsp;Dashboard</router-link>
                <span @click="logout" class="pink-button logo-button hand-cursor" v-if="currentUser.username">Sign&nbspout</span>
            </div>
        </div>

        <!-- FORM MODAL -->
        <div class="modal fade" id="signInModal" tabindex="-1" role="dialog" aria-labelledby="signInModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <!-- <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title">Modal title</h4>
                    </div> -->
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-xs-12" v-if="loginForm">
                                <div class="row text-center">
                                    <div class="col-xs-6 white-tab" @click="changeLoginFormState(true)">
                                        <!-- <button class="blank-button white-tab" @click="changeLoginFormState(true)">Sign in</button> -->
                                        <p>Sign In</p>
                                    </div>
                                    <div class="col-xs-6 grey-tab" @click="changeLoginFormState(false)">
                                        <!-- <button class="blank-button grey-tab" @click="changeLoginFormState(false)">Register</button> -->
                                        <p>Register</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12 login-div">
                                        <div class="login">
                                            <form class="form" @submit.prevent="submitLogin">
                                                <div class="form-group">
                                                    <!-- <label for="email">Email: </label> -->
                                                    <input class="form-control" type="email" name="email" placeholder="E-mail" v-model='login.email' maxlength="255" required>
                                                </div>
                                                <div class="form-group">
                                                    <!-- <label for="password">Password: </label> -->
                                                    <input class="form-control" type="password" name="password" placeholder="Password" v-model='login.password' maxlength="255"
                                                        required>
                                                </div>
                                                <div class="form-group">
                                                    <button type="submit" class="pink-button large-button">Login</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12" v-else>
                                <div class="row text-center">
                                    <div class="col-xs-6 grey-tab" @click="changeLoginFormState(true)">
                                        <!-- <button class="blank-button white-tab" @click="changeLoginFormState(true)">Sign in</button> -->
                                        <p>Sign In</p>
                                    </div>
                                    <div class="col-xs-6 white-tab" @click="changeLoginFormState(false)">
                                        <!-- <button class="blank-button grey-tab" @click="changeLoginFormState(false)">Register</button> -->
                                        <p>Register</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12 login-div">
                                        <div class="register">
                                            <form class="form" @submit.prevent="submitRegister">
                                                <div class="form-group">
                                                    <!-- <label for="username">Username: </label> -->
                                                    <input class="form-control" type="text" name="username" placeholder="Username" v-model='register.username' maxlength="20"
                                                        required>
                                                </div>
                                                <div class="form-group">
                                                    <!-- <label for="email">E-mail: </label> -->
                                                    <input class="form-control" type="email" name="email" placeholder="E-mail" v-model='register.email' maxlength="255" required>
                                                </div>
                                                <div class="form-group">
                                                    <!-- <label for="password">Password: </label> -->
                                                    <input class="form-control" type="password" name="password" placeholder="Password" v-model='register.password' maxlength="255"
                                                        required>
                                                </div>
                                                <div class="form-group">
                                                    <!-- <label for="avatarUrl">Avatar URL: </label> -->
                                                    <input class="form-control" type="text" name="avatarUrl" placeholder="Avatar URL" v-model='register.avatarUrl' maxlength="255"
                                                        required>
                                                </div>
                                                <div class="form-group">
                                                    <!-- <label for="firstName">First Name: </label> -->
                                                    <input class="form-control" type="text" name="firstName" placeholder="First Name" v-model='register.firstName' maxlength="255"
                                                        required>
                                                </div>
                                                <div class="form-group">
                                                    <!-- <label for="lastName">Last Name: </label> -->
                                                    <input class="form-control" type="text" name="lastName" placeholder="Last Name" v-model='register.lastName' maxlength="255"
                                                        required>
                                                </div>
                                                <div class="form-group">
                                                    <button type="submit" class="pink-button large-button">Register</button>
                                                </div>
                                            </form>
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
        <!-- FORM MODAL END -->

    </div>
</template>

<script>
    export default {
        name: 'LogoBar',
        data() {
            return {
                loginForm: true,
                login: {
                    email: '',
                    password: ''
                },
                register: {
                    username: '',
                    email: '',
                    password: '',
                    avatarUrl: '',
                    firstName: '',
                    lastName: ''
                }
            }
        },
        mounted() {

        },
        methods: {
            changeLoginFormState(arg) {
                this.loginForm = arg
            },
            submitLogin() {
                this.$store.dispatch('submitLogin', this.login)
                this.login = {
                    email: '',
                    password: ''
                }
                $('#signInModal').modal('hide')
            },
            submitRegister() {
                this.$store.dispatch('submitRegister', this.register)
                this.register = {
                    username: '',
                    email: '',
                    password: '',
                    avatarUrl: '',
                    firstName: '',
                    lastName: ''
                }
                $('#signInModal').modal('hide')
            },
            logout() {
                this.$store.dispatch('logout')
            }
        },
        computed: {
            currentUser() {
                return this.$store.state.currentUser
            }
        },
        components: {

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .logobar {
        /* height: 75px; */
        background-color: #000000;
        margin-top: 15px;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;

    }

    @media screen and (max-width: 600px) {
        .logobar {
            flex-direction: column;
        }
    }

    .logo-button{
        margin: 5px;
    }

    .logo-buttons {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }

    @media screen and (max-width: 370px) {
        .logo-buttons {
            flex-direction: column;
        }
    }

    .user-salutation {
        color: #ffffff;
        font-size: 2em;
    }

    .black-button {
        background-color: #000000;
        outline: 1px solid #ffffff;
        border: none;
        color: #ffffff;
        padding: 8px 10px;
        margin: 10px;
    }

    .black-button:hover,
    .pink-button:hover {
        background-color: #FFFFFF;
        outline: 1px solid #000000;
        border: none;
        color: #000000;
    }

    .pink-button {
        background-color: #fd0090;
        outline: 1px solid #fd0090;
        border: none;
        color: #ffffff;
        padding: 8px 10px;
    }

    .router-button {
        text-decoration: none;
    }

    .white-tab {
        background-color: #ffffff;
        text-decoration: underline;
    }

    .grey-tab {
        background-color: #d2d8d8;
        color: #919c9b
    }

    .blank-button {
        background: none;
        outline: none;
        border: none;
        background-color: none;
    }

    .large-button {
        width: 100%;
        height: 40px;

    }

    .login-div {
        margin-top: 20px;
    }
</style>