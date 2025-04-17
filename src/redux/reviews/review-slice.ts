import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/auth-axios";
import { ReviewTypes } from "../../types/review";

interface ReviewsState {
  [productId: string]: {
    items: ReviewTypes[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: ReviewsState = {};

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (productId: string) => {
    const { data } = await axios.get<ReviewTypes[]>(
      `/products/${productId}/reviews`
    );
    return { productId, reviews: data };
  }
);

export const addReview = createAsyncThunk<
  { productId: string; reviews: ReviewTypes[] },
  { productId: string; rating: number; comment: string },
  { rejectValue: string }
>(
  "reviews/add",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ReviewTypes[]>(
        `/products/${productId}/reviews`,
        { rating, comment }
      );
      return { productId, reviews: data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const editReview = createAsyncThunk<
  { productId: string; reviewId: string; rating: number; comment: string },
  { productId: string; reviewId: string; rating: number; comment: string },
  { rejectValue: string }
>("reviews/edit", async (payload, { rejectWithValue }) => {
  try {
    await axios.put(
      `/products/${payload.productId}/reviews/${payload.reviewId}`,
      { rating: payload.rating, comment: payload.comment }
    );
    return payload;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteReview = createAsyncThunk<
  { productId: string; reviewId: string },
  { productId: string; reviewId: string },
  { rejectValue: string }
>("reviews/delete", async (payload, { rejectWithValue }) => {
  try {
    await axios.delete(
      `/products/${payload.productId}/reviews/${payload.reviewId}`
    );
    return payload;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state, action) => {
        state[action.meta.arg] = { items: [], loading: true, error: null };
      })
      .addCase(fetchReviews.fulfilled, (state, { payload }) => {
        state[payload.productId] = {
          items: payload.reviews,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state[action.meta.arg] = {
          items: [],
          loading: false,
          error: action.error.message || "Failed to fetch reviews",
        };
      })
      .addCase(addReview.pending, (state, action) => {
        const p = action.meta.arg.productId;
        if (!state[p]) {
          state[p] = { items: [], loading: true, error: null };
        } else {
          state[p].loading = true;
        }
      })
      .addCase(addReview.fulfilled, (state, { payload }) => {
        state[payload.productId] = {
          items: payload.reviews,
          loading: false,
          error: null,
        };
      })
      .addCase(addReview.rejected, (state, action) => {
        const p = action.meta.arg.productId;
        if (!state[p]) {
          state[p] = { items: [], loading: false, error: action.payload! };
        } else {
          state[p].loading = false;
          state[p].error = action.payload!;
        }
      })
      .addCase(editReview.pending, (state, action) => {
        const p = action.meta.arg.productId;
        if (state[p]) state[p].loading = true;
      })
      .addCase(editReview.fulfilled, (state, { payload }) => {
        const { productId, reviewId, rating, comment } = payload;
        const itemList = state[productId]?.items;
        if (itemList) {
          const idx = itemList.findIndex((r) => r._id === reviewId);
          if (idx > -1) {
            itemList[idx] = { ...itemList[idx], rating, comment };
          }
          state[productId]!.loading = false;
        }
      })
      .addCase(editReview.rejected, (state, action) => {
        const p = action.meta.arg.productId;
        if (state[p]) {
          state[p].loading = false;
          state[p].error = action.payload!;
        }
      })
      .addCase(deleteReview.pending, (state, action) => {
        const p = action.meta.arg.productId;
        if (state[p]) state[p].loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, { payload }) => {
        const { productId, reviewId } = payload;
        const itemList = state[productId]?.items;
        if (itemList) {
          state[productId]!.items = itemList.filter((r) => r._id !== reviewId);
          state[productId]!.loading = false;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        const p = action.meta.arg.productId;
        if (state[p]) {
          state[p].loading = false;
          state[p].error = action.payload!;
        }
      });
  },
});

export default reviewsSlice;
