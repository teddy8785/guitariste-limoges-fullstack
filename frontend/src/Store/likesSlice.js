import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {}, // items: { [itemId]: { liked, count } }
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    setLikeStatus(state, action) {
      const { itemId, liked, count } = action.payload;
      const existing = state.items[itemId];

      // Ne modifie que si changement réel (évite rerender inutile)
      if (!existing || existing.liked !== liked || existing.count !== count) {
        state.items[itemId] = { liked, count };
      }
    },
    updateLikes(state, action) {
      // action.payload = { [itemId]: { liked, count }, ... }
      Object.entries(action.payload).forEach(([itemId, likeData]) => {
        state.items[itemId] = likeData;
      });
    },
    resetLikes(state) {
      state.items = {};
    },
  },
});

export const fetchUserLikes = (userId, token) => async (dispatch) => {
  try {
    const backendUrl = "http://localhost:4000";
    const res = await fetch(
      `${backendUrl}/api/likes/user/${userId}/liked-profiles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur fetch user likes: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    const likesObj = {};
    data.likedProfiles.forEach((profile) => {
      likesObj[profile._id] = { liked: true, count: profile.likeCount || 1 };
    });

    dispatch(updateLikes(likesObj));
  } catch (error) {
    console.error(error);
  }
};

export const { setLikeStatus, updateLikes, resetLikes } = likesSlice.actions;
export default likesSlice.reducer;
