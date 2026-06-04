'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function submitAdmissionLead(formData: FormData) {
  try {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();
    const course_interest = formData.get('course_interest')?.toString();
    const message = formData.get('message')?.toString();

    if (!name || !email) {
      return { error: 'Name and email are required.' };
    }

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert([
        {
          name,
          email,
          phone,
          course_interest,
          message,
          status: 'new'
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return { error: 'Failed to submit inquiry. Please try again later.' };
    }

    // Revalidate admin paths if needed
    revalidatePath('/admin/inquiries');
    
    return { success: true, message: 'Thank you! Our counselor will contact you shortly.' };
  } catch (error) {
    console.error('Lead submission error:', error);
    return { error: 'An unexpected error occurred.' };
  }
}
