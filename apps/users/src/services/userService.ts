import bcrypt from "bcrypt";
import { User } from "@repo/db";
import { sendMessage, LEGACY_TOPICS, UserCreatedMessage } from "@repo/kafka";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface GetUserRequest {
  id: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

const SALT_ROUNDS = 10;

export const userService = {
  getUser: async (request: GetUserRequest): Promise<IUser> => {
    const user = await User.findById(request.id);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  register: async (request: RegisterRequest) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: request.email });
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
        userId: "",
      };
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(request.password, SALT_ROUNDS);

    // Create new user
    const newUser = new User({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      role: request.role || "user",
      isActive: true,
    });

    await newUser.save();

    // Send Kafka message for user creation notification
    try {
      const userCreatedMessage: UserCreatedMessage = {
        userId: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: new Date().toISOString(),
      };

      await sendMessage(LEGACY_TOPICS.USER_CREATED, "USER_CREATED", userCreatedMessage);
      console.log(`📤 User created event sent for: ${newUser.email}`);
    } catch (kafkaError) {
      console.error("Failed to send Kafka message:", kafkaError);
      // Don't fail the registration if Kafka message fails
    }

    return {
      success: true,
      message: "User registered successfully",
      userId: newUser._id.toString(),
    };
  },

  login: async (request: LoginRequest) => {
    // Find user by email
    const user = await User.findOne({ email: request.email });
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
        userId: "",
        email: "",
        name: "",
        role: "",
      };
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(request.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
        userId: "",
        email: "",
        name: "",
        role: "",
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: "Account is deactivated",
        userId: "",
        email: "",
        name: "",
        role: "",
      };
    }

    return {
      success: true,
      message: "Login successful",
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
};
