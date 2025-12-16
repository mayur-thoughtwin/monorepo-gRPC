import { userClient } from "../clients/userClient";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  userId: string;
  email: string;
  name: string;
  role: string;
}

export const authService = {
  register: (data: RegisterRequest): Promise<RegisterResponse> => {
    return new Promise((resolve, reject) => {
      userClient.Register(
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || "user",
        },
        (err: any, response: RegisterResponse) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });
  },

  login: (data: LoginRequest): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      userClient.Login(
        {
          email: data.email,
          password: data.password,
        },
        (err: any, response: LoginResponse) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });
  },
};

