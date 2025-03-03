"use server";

import { cookies } from "next/headers";
import db from '@/lib/db'; // Assuming you have a MySQL setup here
import bcrypt from 'bcryptjs'; // bcryptjs for password hashing
import jwt from 'jsonwebtoken';  // For JWT token generation
import PasswordHash from 'wordpress-password-js';

// Helper function to generate a JWT with user ID
function generateToken(userId: number): string {
  const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Use environment variables for the secret key
  const payload = { userId };  // Including user ID in the token
  const options = { expiresIn: '1h' }; // Token expiration time (1 hour)

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
  const { firstName, lastName, email, password } = params;

  try {
    // Simulate storing the user in the WordPress database
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing it

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
    // Query WordPress database for user by email
    const [results] = await db.promise().query('SELECT * FROM wp_users WHERE user_email = ?', [email]);

    if (results.length === 0) {
      return { error: "User Invalid!" };
    }

    const user = results[0];

    // WordPress uses a salted MD5 hash or phpass for password hashing, so bcrypt won't work here.
    // You must use WordPress password validation or API.
    // For now, let's assume we're using bcrypt for comparison, which is incorrect for WordPress passwords
    // Ideally, you should use WordPress's API or replicate WordPress password hash checking.
    
    const wordpressHasher = new PasswordHash()

    // Simulate password checking with bcrypt (this won't work for WordPress directly)
    const isPasswordValid = await wordpressHasher.check(password, user.user_pass);

    if (!isPasswordValid) {
      return { error: "Invalid credentials" };
    }

    // Generate JWT token with user ID
    const token = generateToken(user.ID);

    // Store the JWT in a cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, { httpOnly: true, maxAge: 3600 }); // 1-hour expiry

    return { data: { user } };

  } catch (err) {
    console.error(err);
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
