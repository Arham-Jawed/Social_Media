import axiosInstance from "../lib/index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useCreatePost = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (userData) => {
      try {
        const res = await axiosInstance.post("/api/posts/create", userData);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      navigate("/");
    },
  });
};

export const useGetFeedPosts = () => {
  return useQuery({
    queryKey: ["FEED_POSTS"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/posts");
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
        const res = await axiosInstance.delete(`/api/posts/${postId}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return true;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["FEED_POSTS"]);
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosInstance.post(`/api/posts/like/${id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["FEED_POSTS"]);
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosInstance.post(`/api/posts/save/${id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["FEED_POSTS"]);
    },
  });
};

export const useGetExplorePosts = () => {
  return useQuery({
    queryKey: ["EXPLORE_POSTS"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/posts/explore");
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

export const useGetPost = (id) => {
  return useQuery({
    queryKey: ["POST", id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/api/posts/${id}`);
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
    mutationFn: async ({ content, id }) => {
      try {
        const res = await axiosInstance.post(`/api/posts/comment/${id}`, {
          content,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["POST"]);
    },
  });
};
