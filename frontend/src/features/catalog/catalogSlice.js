import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stock:[],
    selectedItem:null
}

const catalogSlice = createSlice ({
    name:'catalog',
    initialState,
    reducers:{
        setStock:(state,action) =>{
            state.stock = action.payload
        },
        selectItem:(state,action)=>{
            state.selectedItem =action.payload
        }
    }
})

export const { setStock, selectItem } = catalogSlice.actions
export default catalogSlice.reducer