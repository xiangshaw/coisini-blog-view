import {defineStore} from "pinia"
import {ref} from 'vue'

export const useMySearch
    = defineStore('mySearch', () => {

    const mySearch = ref({})
    const setMySearch = (newMySearch) => {
        mySearch.value = newMySearch
    }
    const removeMySearch = () => {
        mySearch.value = {}
    }
    return {
        mySearch,
        setMySearch,
        removeMySearch
    }
}, {
    persist: true
})