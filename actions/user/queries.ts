"use server";

import { client } from "@/lib/prisma";

export const findUser = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      subscription: true,
      integrations: {
        select: {
          id: true,
          token: true,
          expiresAt: true,
          name: true,
        },
      },
    },
  });
};

export const createUser = async (
  clerkId: string,
  firstname: string,
  lastname: string,
  email: string
) => {
  try {
    // First check if user already exists to avoid duplicate key errors
    const existingUser = await client.user.findUnique({
      where: { clerkId }
    });

    if (existingUser) {
      // User exists, return it
      return existingUser;
    }

    // Create user with subscription in a transaction to ensure consistency
    return await client.$transaction(async (tx) => {
      // Create the base user first
      const newUser = await tx.user.create({
        data: {
          clerkId,
          firstname,
          lastname,
          email,
        },
      });

      // Then create subscription separately
      await tx.subscription.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });
  } catch (error) {
    console.error('Error creating user:', error);
    // Return a default user object with minimal data to prevent UI errors
    return { firstname, lastname };
  }
};

export const updateSubscription = async (
  clerkId: string,
  props: { customerId?: string; plan?: "PRO" | "FREE" }
) => {
  try {
    // First check if user exists
    const user = await client.user.findUnique({
      where: { clerkId },
      include: { subscription: true }
    });

    if (!user) {
      console.error('Cannot update subscription: User not found');
      return null;
    }

    // If user has no subscription, create one
    if (!user.subscription) {
      return await client.user.update({
        where: { clerkId },
        data: {
          subscription: {
            create: props
          }
        }
      });
    }

    // Otherwise update the existing subscription
    return await client.user.update({
      where: { clerkId },
      data: {
        subscription: {
          update: props
        }
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return null;
  }
};
