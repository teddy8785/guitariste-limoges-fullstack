import { createSelector } from "@reduxjs/toolkit";

export const makeSelectLikeForItem = (itemId) =>
  createSelector(
    (state) => state.likes.items,
    (items) => items[itemId] || { liked: false, count: 0 }
  );