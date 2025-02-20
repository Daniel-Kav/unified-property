import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/backend';
// import { env } from '../config/env';
// import { db } from '../db';
// import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { usersTable } from '../drizzle/schema';
import db from '../drizzle/db';
import { env } from '../config/env';

// This is the type for the user data we receive from Clerk
type UserWebhookEvent = {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string;
    created_at: number;
    updated_at: number;
  };
};

export async function handleClerkWebhook(request: Request) {
  // Get the headers
  const svix_id = request.headers.get('svix-id');
  const svix_timestamp = request.headers.get('svix-timestamp');
  const svix_signature = request.headers.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  const { id, email_addresses, first_name, last_name, image_url, created_at, updated_at } = 
    (evt as UserWebhookEvent).data;

  if (eventType === 'user.created') {
    console.log(id, email_addresses, first_name, last_name, image_url, created_at, updated_at);
    // Create user in your database
    await db.insert(usersTable).values({
      user_id: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
      createdAt: new Date(created_at * 1000),
      updatedAt: new Date(updated_at * 1000),
    });
  } else if (eventType === 'user.updated') {
    // Update user in your database
    await db.update(usersTable)
      .set({
        email: email_addresses[0].email_address,
        full_name: `${first_name} ${last_name}`,
      })
      .where(eq(usersTable.user_id, Number(id)));
  } else if (eventType === 'user.deleted') {
    // Delete user from your database
    await db.delete(usersTable).where(eq(usersTable.user_id, id));
  }

  return new Response('Webhook received', { status: 200 });
}
