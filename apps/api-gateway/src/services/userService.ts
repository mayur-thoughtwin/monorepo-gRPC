import { userClient } from "../clients/userClient";

export interface User {
  id: string;
  name: string;
  email: string;
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
};

