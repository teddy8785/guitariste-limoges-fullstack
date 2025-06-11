import { createSlice } from '@reduxjs/toolkit';

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    items: {},
  },
  reducers: {
    setLikeStatus: (state, action) => {
      const { itemId, liked, count } = action.payload;
      state.items[itemId] = { liked, count };
    },
  },
});

export const { setLikeStatus } = likesSlice.actions;
export default likesSlice.reducer;