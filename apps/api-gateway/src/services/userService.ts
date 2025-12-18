import { userClient } from "../clients/userClient";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface GetUsersResponse {
  users: User[];
}

export interface GetUserRequest {
  id: string;
}

export const userService = {
  getUser: (id: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      userClient.GetUser({ id }, (err: any, data: User) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  getUsers: (): Promise<GetUsersResponse> => {
    return new Promise((resolve, reject) => {
      userClient.GetUsers({}, (err: any, data: GetUsersResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
};

