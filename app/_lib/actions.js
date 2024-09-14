'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { getBookings } from './data-service';
import { supabase } from './supabase';
import { redirect } from 'next/navigation';

export async function updateGuest(formData) {
  const session = await auth();
  if (!session)
    throw new Error('You must be logged in to perform this action!');

  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');
  const NationalIdVerification = /^[a-zA-Z0-9]{6,12}$/;

  if (!NationalIdVerification.test(nationalID))
    throw new Error(
      'Invalid ID format, format should be between 6 and 12 characters!'
    ); // true if valid

  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId);

  if (error) throw new Error('Guest could not be updated');
  revalidatePath('/account/profile');
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session)
    throw new Error('You must be logged in to perform this action!');

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };

  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    console.log(error);
    throw new Error('Booking could not be created');
  }

  revalidatePath(`/cabin/${bookingData.cabinId}`);

  redirect('/cabins/thankyou');
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session)
    throw new Error('You must be logged in to perform this action!');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map(booking => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('No booking found with this ID!');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    throw new Error('Booking could not be deleted');
  }
  revalidatePath('/account/reservations');
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get('bookingId'));
  // 1 - authentication

  const session = await auth();
  if (!session)
    throw new Error('You must be logged in to perform this action!');

  // 2 - Authorization

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map(booking => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('No booking found with this ID!');

  // 3 - Building update data
  const updateData = {
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
  };

  // 4 - Mutation
  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();

  // 5 - Error handling
  if (error) {
    throw new Error('Booking could not be updated');
  }

  // 6 - Data revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath(`/account/reservations`);

  // 7 - redirection
  redirect('/account/reservations');
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
