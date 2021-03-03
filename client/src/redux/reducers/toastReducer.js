import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    notifications: []
}


const toastSlice = createSlice({
    name: 'toasts',
    initialState,
    reducers: {
        addToast(state, action) {
            const toast = action.payload;
            toast.id = new Date(); //uuidv4();
            state.notifications.push(toast);
        },
        addToasts(state, action) {
            const toasts = action.payload;
            toasts.forEach(toast => {
                toast.id = new Date(); //uuidv4();
                state.notifications.push(toast);
            });
        },
        clearAllToast(state, action) {
            state.notifications.splice(0);
        }
    },
})

export const { addToast, addToasts, clearAllToast } = toastSlice.actions;

export const toastReducer = toastSlice.reducer;