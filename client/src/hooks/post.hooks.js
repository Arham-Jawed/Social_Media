import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: async ({ caption, postImage, location }) => {
      try {
        const res = await axios.post("/api/v1/posts/create", {
          caption,
          postImage,
          location,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useGetFeedPosts = () => {
  return useQuery({
    queryKey: ["FEED_POSTS"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/posts/feed");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.posts;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId) => {
      try {
        const res = await axios.delete(`/api/v1/posts/${postId}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["FEED_POSTS", "EXPLORE_POSTS"]);
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId) => {
      try {
        const res = await axios.post(`/api/v1/posts/like/${postId}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["FEED_POSTS", "EXPLORE_POSTS"]);
    },
  });
};

export const useGetExplorePosts = () => {
  return useQuery({
    queryKey: ["EXPLORE_POSTS"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/posts/explore");
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.posts;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useGetPostById = (id) => {
  return useQuery({
    queryKey: ["POST_BY_ID"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/posts/${id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.post;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
};

export const useCommentOnPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, text }) => {
      try {
        const res = await axios.post(`/api/v1/posts/comment/${id}`, {
          text,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["POST_BY_ID"]);
    },
  });
};
