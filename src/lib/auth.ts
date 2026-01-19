import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: email,
          subject: "Sign in to Thai Rental",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #122B45;">Sign in to Thai Rental</h2>
              <p>Click the button below to sign in to your account. This link will expire in 10 minutes.</p>
              <a href="${url}" style="display: inline-block; background-color: #122B45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                Sign In
              </a>
              <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
              <p style="color: #666; font-size: 14px;">Or copy and paste this link: ${url}</p>
            </div>
          `,
        });
      },
      expiresIn: 600, // 10 minutes
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // Don't allow users to set their own role
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});