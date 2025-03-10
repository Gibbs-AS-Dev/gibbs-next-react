"use server";

import { cookies } from "next/headers";
import db from '@/lib/db'; // Assuming you have a MySQL setup here
import jwt, { SignOptions } from 'jsonwebtoken';
import PasswordHash from 'wordpress-password-js';

import { User } from "@/lib/custom-auth/types";

// Helper function to generate a JWT with user ID
function generateToken(userId: number): string {
  const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Use environment variables for the secret key
  const payload = { userId };  // Including user ID in the token
  const options: SignOptions = { expiresIn: '1h' as const };

  return jwt.sign(payload, secretKey, options);
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: "google" | "discord";
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

// Simulated user data (for illustration purposes)
const user = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
};


// SignUp function to register new users
export async function signUp(
  params: SignUpParams
): Promise<{ data?: { user: User }; error?: string }> {
  
  try {
    // Simulate storing the user in the WordPress database
    //const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing it

    // Here you'd typically insert the user into the database.
    // Simulate database insertion

    // After inserting, generate a token for the user
    const token = generateToken(user.id);

    // Set the token in a cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, { httpOnly: true, maxAge: 3600 });

    return { data: { user } };
  } catch (err) {
    console.error(err);
    return { error: "Sign-up failed" };
  }
}

// SignIn function with OAuth (Google/Discord) - placeholder
export async function signInWithOAuth(
  params: SignInWithOAuthParams
): Promise<{ error?: string }> {
  return { error: "Social authentication not implemented" };
}

// SignIn function with password authentication
export async function signInWithPassword(
  params: SignInWithPasswordParams
): Promise<{ data?: { user: User }; error?: string }> {
  const { email, password } = params;

  try {
    // Check if the database is connected
    const [rowsdata] = await db.promise().query("SELECT 1");
    console.log("✅ Database Connection Test:", rowsdata);

    // Query WordPress database for user by email
    const [results]: any = await db.promise().query(
      "SELECT * FROM "+process.env.NEXT_DBPREFIX+"users WHERE user_email = ?",
      [email]
    );

    if (!results || results.length === 0) {
      return { error: "User Invalid!" };
    }

    const user = results[0];
    console.log(user)

    // WordPress uses a special password hashing method.
    const wordpressHasher = new PasswordHash();
    console.log("Methods available in wordpressHasher:", Object.getOwnPropertyNames(Object.getPrototypeOf(wordpressHasher)));

    // Ensure you're using the correct method: `CheckPassword`
    const isPasswordValid = wordpressHasher.check(password, user.user_pass);

    if (!isPasswordValid) {
      return { error: "Invalid credentials" };
    }

    // Generate JWT token with user ID
    const token = generateToken(Number(user.ID));

    // Store the JWT in a cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, { httpOnly: true, maxAge: 3600 }); // 1-hour expiry

    return { data: { user } };
  } catch (err) {
    console.error("❌ Database Query Failed:", err);
    return { error: "Database query failed" };
  }
}


// Reset password functionality (currently not implemented)
export async function resetPassword(
  params: ResetPasswordParams
): Promise<{ error?: string }> {
  return { error: "Password reset not implemented" };
}

// Update password functionality (currently not implemented)
export async function updatePassword(
  params: ResetPasswordParams
): Promise<{ error?: string }> {
  return { error: "Update reset not implemented" };
}

// SignOut function to clear the cookie
export async function signOut(): Promise<{ error?: string }> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");

  return {};
}
