import {defineStore} from "pinia"
import {ref} from 'vue'

export const useMyCategoryStore = defineStore('myCategory', () => {

    const myCategory = ref({})
    const setMyCategory = (newmyCategory) => {
        myCategory.value = newmyCategory
    }
    const removeMyCategory = () => {
        myCategory.value = {}
    }

    return {
        myCategory,
        setMyCategory,
        removeMyCategory
    }
}, {
    persist: true
})