import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { copyCard, createCard, deleteCard, fetchCards as fetchCardsRequest, updateCard } from "@/services/card-service";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchCards = createAsyncThunk("cards/fetchCards", async (_, { rejectWithValue }) => {
  try {
    return await fetchCardsRequest();
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createCardThunk = createAsyncThunk("cards/createCard", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await createCard(payload);
    await dispatch(fetchCards());
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateCardThunk = createAsyncThunk("cards/updateCard", async ({ cardId, payload }, { dispatch, rejectWithValue }) => {
  try {
    const response = await updateCard(cardId, payload);
    await dispatch(fetchCards());
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteCardThunk = createAsyncThunk("cards/deleteCard", async (cardId, { dispatch, rejectWithValue }) => {
  try {
    const response = await deleteCard(cardId);
    await dispatch(fetchCards());
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const copyCardThunk = createAsyncThunk("cards/copyCard", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await copyCard(payload);
    await dispatch(fetchCards());
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch cards.";
      });
  },
});

export const selectCards = (state) => state.cards.items;
export const selectCardsStatus = (state) => state.cards.status;
export const selectCardsError = (state) => state.cards.error;

export default cardsSlice.reducer;