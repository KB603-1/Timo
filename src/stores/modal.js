import {defineStore} from "pinia";
import {ref, shallowRef} from "vue";

export const useModalStore = defineStore("modal", () => {
    const isOpen = ref(false);
    const component = shallowRef(null);
    const props = ref({});

    function openModal(c, p = {}) {
        isOpen.value = true;
        component.value = c;
        props.value = p;
    }

    function closeModal() {
        isOpen.value = false;
        component.value = null;
        props.value = {};
    }

    return {
        isOpen,
        component,
        props,
        openModal,
        closeModal
    };
});