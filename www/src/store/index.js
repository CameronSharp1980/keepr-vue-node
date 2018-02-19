import Axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

let auth = Axios.create({
    // baseURL: window.location.host.includes("localhost") ? 'http://localhost:3000/accounts/' : '/accounts/',
    baseURL: window.location.host.includes("localhost") ? 'http://localhost:3000/' : '/accounts/',
    timeout: 2000,
    withCredentials: true
})

let api = Axios.create({
    baseURL: window.location.host.includes("localhost") ? 'http://localhost:3000/api/' : '/api/',
    timeout: 2000,
    withCredentials: true
})

Vue.use(Vuex)

var store = new Vuex.Store({
    state: {
        error: {},
        message: "",
        currentUser: {},
        keeps: [],
        userKeeps: [],
        userVaults: [],
        currentVault: {},
        currentVaultKeeps: []
    },
    mutations: {

        handleError(state, err) {
            state.error = err
        },
        setCurrentUser(state, user) {
            state.currentUser = user
            // console.log(state.user)
        },
        setMessage(state, msg) {
            state.message = msg
        },
        setKeeps(state, keeps) {
            state.keeps = keeps
        },
        setUserKeeps(state, keeps) {
            state.userKeeps = keeps
        },
        setUserVaults(state, vaults) {
            state.userVaults = vaults
        },
        setCurrentVault(state, vault) {
            state.currentVault = vault
        },
        setCurrentVaultKeeps(state, vaultKeeps) {
            state.currentVaultKeeps = vaultKeeps
        }

    },
    actions: {

        //#region UserAuth

        submitRegister({ commit, dispatch }, newUser) {
            auth.post('register', newUser)
                .then(res => {
                    if (res.data.data) {
                        commit('setCurrentUser', res.data.data)
                        // router.push({ name: "Home" })
                    } else {
                        // router.push({ name: "Login" })
                        //Line below might need to be res or err (Check after frontend auth ready)
                        commit('handleError', { message: 'Authentication failed!' })
                    }
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        submitLogin({ commit, dispatch }, user) {
            auth.post('login', user)
                .then(res => {
                    if (res.data.data) {
                        commit('setCurrentUser', res.data.data)
                        dispatch('getUserVaults', res.data.data._id)
                        dispatch('getUserKeeps', res.data.data._id)
                        // router.push({ name: "Home" })
                    } else {
                        // router.push({ name: "Login" })
                        //Line below might need to be res or err (Check after frontend auth ready)
                        commit('handleError', { message: 'Authentication failed!' })
                    }
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        logout({ commit, dispatch }) {
            auth.delete('logout')
                .then(res => {
                    commit('setCurrentUser', {})
                    commit('setUserVaults', {})
                    commit('setUserKeeps', {})
                    commit('setCurrentVault', {})
                    commit('setCurrentVaultKeeps', [])
                    router.push({ name: "Keepr" })
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        authenticate({ commit, dispatch }) {
            auth('authenticate')
                .then(res => {
                    // console.log("Response @ auth: ", res.data)
                    if (res.data.data) {
                        commit('setCurrentUser', res.data.data)
                        dispatch('getUserVaults', res.data.data._id)
                        dispatch('getUserKeeps', res.data.data._id)
                        // console.log(res.data.data)
                        // router.push({ name: "Home" })
                    } else {
                        //Line below might need to be res or err (Check after frontend auth ready)
                        commit('handleError', { message: 'Authentication failed!' })
                        router.push({ name: "Keepr" })
                    }
                })
                .catch((err) => {
                    commit('handleError', err)
                })
        },

        //#endregion

        //#region Vault Functions

        setCurrentVault({ commit, dispatch }, vault) {
            commit('setCurrentVault', vault)
        },
        getUserVaults({ commit, dispatch }, currentUserId) {
            api(`vaults/${currentUserId}`)
                .then(res => {
                    // console.log(res)
                    commit('setUserVaults', res.data)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        submitVault({ commit, dispatch }, payload) {
            // console.log(payload.vault)
            api.post('vaults', payload.vault)
                .then(res => {
                    if (res) {
                        //res = whole posting or res.data = whole posting?
                        commit('setMessage', `New Vault: ${payload.vault.name} posted successfully`)
                    } else {
                        commit('setMessage', `New Vault: ${payload.vault.name} Did NOT post successfully`)
                    }
                })
                .catch(err => {
                    commit('handleError', err)
                })
                .then(res => {
                    dispatch('getUserVaults', payload.currentUser._id)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        // NOT CURRENTLY IMPLEMENTED
        // updateVault({ commit, dispatch }, payload) {
        //     if (payload.currentUser.id == payload.vault.userId) {
        //         api.put(`vaults/${payload.vault.id}`)
        //             .then(res => {
        //                 if (res) {
        //                     commit('setMessage', `Vault: ${payload.vault.name} updated successfully`)
        //                     return res
        //                 } else {
        //                     commit('setMessage', `Vault: ${payload.vault.name} was not updated successfully`)
        //                     return res
        //                 }
        //             })
        //             .catch(err => {
        //                 commit('handleError', err)
        //             })
        //             .then(res => {
        //                 dispatch('getUserVaults', payload.currentUser.id)
        //             })
        //             .catch(err => {
        //                 commit('handleError', err)
        //             })
        //     } else {
        //         commit('handleError', { message: 'You are not the owner of that vault, and therefore not authorized to update it.' })
        //     }
        // },
        removeVault({ commit, dispatch }, payload) {
            if (payload.currentUser._id == payload.vault.userId) {
                api.delete(`vaults/${payload.vault._id}`)
                    .then(res => {
                        if (res) {
                            commit('setMessage', `Vault: ${payload.vault.name} removed successfully`)
                            return res
                        } else {
                            commit('setMessage', `Vault: ${payload.vault.name} was not removed successfully`)
                            return res
                        }
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
                    .then(res => {
                        dispatch('getUserVaults', payload.currentUser._id)
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
            } else {
                commit('handleError', { message: 'You are not the owner of that vault, and therefore not authorized to remove it.' })
            }
        },
        removeKeepFromVault({ commit, dispatch }, payload) {
            if (payload.currentUser._id == payload.currentVault.userId) {
                api.put(`vaults/${payload.currentVault._id}/keeps/${payload.keep._id}`)
                    .then(res => {
                        if (res) {
                            commit('setMessage', `Keep: ${payload.keep.name} removed successfully from Vault: ${payload.currentVault.name}`)
                            return res
                        } else {
                            commit('setMessage', `Keep: ${payload.keep.name} was not removed successfully from Vault: ${payload.currentVault.name}`)
                            return res
                        }
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
                    .then(res => {
                        dispatch('getUserVaults', payload.currentUser._id)
                        dispatch('getKeepsInVault', payload.currentVault._id)
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
            } else {
                commit('handleError', { message: 'You are not the owner of that vault, and therefore not authorized to remove it.' })
            }
        },

        //#endregion

        //#region Keep Functions

        getKeeps({ commit, dispatch }) {
            api(`keeps`)
                .then(res => {
                    // console.log(res)
                    commit('setKeeps', res.data)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        getUserKeeps({ commit, dispatch }, currentUserId) {
            // console.log(`Current userId from 'getUserKeeps' ${currentUserId}`)
            api(`keeps/${currentUserId}`)
                .then(res => {
                    // console.log(res)
                    commit('setUserKeeps', res.data)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        submitKeep({ commit, dispatch }, payload) {
            // console.log(payload.keep)
            api.post('keeps', payload.keep)
                .then(res => {
                    if (res) {
                        //res = whole posting or res.data = whole posting?
                        commit('setMessage', `New Keep: ${payload.keep.name} posted successfully`)
                    } else {
                        commit('setMessage', `New Keep: ${payload.keep.name} Did NOT post successfully`)
                    }
                })
                .catch(err => {
                    commit('handleError', err)
                })
                .then(res => {
                    dispatch('getKeeps')
                    dispatch('getUserKeeps', payload.currentUser._id)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        // IMPLEMENT ABILITY TO EDIT KEEP AND VAULT DETAILS.
        updateKeep({ commit, dispatch }, payload) {
            console.log(payload)
            if (payload.currentUser._id == payload.keep.userId) {
                api.put(`keeps/${payload.keep._id}`, payload.keepData)
                    .then(res => {
                        if (res) {
                            commit('setMessage', `Keep: ${payload.keep.name} updated successfully`)
                            return res
                        } else {
                            commit('setMessage', `Keep: ${payload.keep.name} was not updated successfully`)
                            return res
                        }
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
                    .then(res => {
                        dispatch('getKeeps')
                        dispatch('getUserKeeps', payload.currentUser._id)
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
            } else {
                commit('handleError', { message: 'You are not the owner of that keep, and therefore not authorized to update it.' })
            }
        },
        incrementSocials({ commit, dispatch }, payload) {
            if (payload.keepData.views || payload.keepData.keeps) {
                api.put(`keeps/${payload.keep._id}`, payload.keepData)
                    .then(res => {
                        if (res) {
                            commit('setMessage', `Keep: ${payload.keep.name} updated successfully`)
                            return res
                        } else {
                            commit('setMessage', `Keep: ${payload.keep.name} was not updated successfully`)
                            return res
                        }
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
                    .then(res => {
                        dispatch('getKeeps')
                        dispatch('getUserKeeps', payload.currentUser._id)
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
            } else {
                commit('handleError', { message: 'You are not the owner of that keep, and therefore not authorized to update it.' })
            }
        },
        // incrementViews({ commit, dispatch }, payload) {
        //     payload.keep.views++
        //     api.put(`keeps/${payload.keep._id}/views`, { views: payload.keep.views })
        //         .then(res => {
        //             if (res) {
        //                 commit('setMessage', `Keep: ${payload.keep.name} updated successfully`)
        //                 return res
        //             } else {
        //                 commit('setMessage', `Keep: ${payload.keep.name} was not updated successfully`)
        //                 return res
        //             }
        //         })
        //         .catch(err => {
        //             commit('handleError', err)
        //         })
        //         .then(res => {
        //             dispatch('getKeeps')
        //             dispatch('getUserKeeps', payload.currentUser.id)
        //         })
        //         .catch(err => {
        //             commit('handleError', err)
        //         })
        // },
        // incrementKeeps({ commit, dispatch }, payload) {
        //     payload.keep.keeps++
        //     api.put(`keeps/${payload.keep._id}/keeps`, { keeps: payload.keep.keeps })
        //         .then(res => {
        //             if (res) {
        //                 commit('setMessage', `Keep: ${payload.keep.name} updated successfully`)
        //                 return res
        //             } else {
        //                 commit('setMessage', `Keep: ${payload.keep.name} was not updated successfully`)
        //                 return res
        //             }
        //         })
        //         .catch(err => {
        //             commit('handleError', err)
        //         })
        //         .then(res => {
        //             dispatch('getKeeps')
        //             dispatch('getUserKeeps', payload.currentUser._id)
        //         })
        //         .catch(err => {
        //             commit('handleError', err)
        //         })
        // },
        togglePublic({ commit, dispatch }, payload) {
            if (payload.currentUser._id == payload.keep.userId) {
                payload.keep.public = !payload.keep.public
                api.put(`keeps/${payload.keep._id}`, { public: payload.keep.public })
                    .then(res => {
                        if (res) {
                            commit('setMessage', `Keep: ${payload.keep.name} updated successfully`)
                            return res
                        } else {
                            commit('setMessage', `Keep: ${payload.keep.name} was not updated successfully`)
                            return res
                        }
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
                    .then(res => {
                        dispatch('getKeeps')
                        dispatch('getUserKeeps', payload.currentUser._id)
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
            }
        },
        removeKeep({ commit, dispatch }, payload) {
            if (payload.currentUser._id == payload.keep.userId) {
                api.delete(`keeps/${payload.keep._id}`)
                    .then(res => {
                        if (res) {
                            commit('setMessage', `Keep: ${payload.keep.name} removed successfully`)
                            return res
                        } else {
                            commit('setMessage', `Keep: ${payload.keep.name} was not removed successfully`)
                            return res
                        }
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
                    .then(res => {
                        dispatch('getKeeps')
                        dispatch('getUserKeeps', payload.currentUser._id)
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
            } else {
                commit('handleError', { message: 'You are not the owner of that keep, and therefore not authorized to remove it.' })
            }
        },

        //#endregion

        //#region VaultKeep Functions

        getKeepsInVault({ commit, dispatch }, vaultId) {
            if (vaultId) {
                api(`vaults/${vaultId}/keeps`)
                    .then(res => {
                        commit('setCurrentVaultKeeps', res.data)
                    })
                    .catch(err => {
                        commit('handleError', err)
                    })
            } else {
                commit('setCurrentVaultKeeps', [])
            }
        },
        submitKeepToVault({ commit, dispatch }, payload) {
            payload.vault.vaultKeeps.push(payload.keep._id)
            // payload.vaultKeep.userId = payload.currentUser.id 
            // console.log(payload.vaultKeep)
            api.put(`vaults/${payload.vault._id}`, { vaultKeeps: payload.vault.vaultKeeps })
                .then(res => {
                    if (res) {
                        //res = whole posting or res.data = whole posting?
                        commit('setMessage', `Keep ${payload.keep.name} added successfully to vault ${payload.vault.name}`)
                    } else {
                        commit('setMessage', `Keep ${payload.keep.name} did NOT post successfully to vault ${payload.vault.name}`)
                    }
                })
                .catch(err => {
                    commit('handleError', err)
                })
                .then(res => {
                    dispatch('getKeepsInVault', payload.vault._id)
                })
                .catch(err => {
                    commit('handleError', err)
                })
        },
        // PLACED THIS FUNCTION IN VAULTS SECTION FOR BETTER REST-FULL-NESS
        // removeKeepFromVault({ commit, dispatch }, payload) {
        //     if (payload.currentUser.id == payload.vaultKeep.userId) {
        //         api.delete(`vaultkeeps/${payload.vaultKeep.id}`)
        //             .then(res => {
        //                 if (res) {
        //                     commit('setMessage', `VaultKeep removed successfully`)
        //                     return res
        //                 } else {
        //                     commit('setMessage', `VaultKeep was not removed successfully`)
        //                     return res
        //                 }
        //             })
        //             .catch(err => {
        //                 commit('handleError', err)
        //             })
        //             .then(res => {
        //                 dispatch('getKeepsInVault', payload.vaultId)
        //             })
        //             .catch(err => {
        //                 commit('handleError', err)
        //             })
        //     } else {
        //         commit('handleError', { message: 'You are not the owner of that VaultKeep, and therefore not authorized to remove it.' })
        //     }
        // }

        //#endregion

    }
})

export default store