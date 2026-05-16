import { baseApi } from "../../services/baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (data: LoginRequest) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Register
    register: builder.mutation({
      query: (data: RegisterRequest) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;