import { supabase } from '@/lib/supabaseClient';

export const testimonialService = {
  // Function to submit a new testimonial
  submitTestimonial: async (testimonialData) => {
    try {
      const { data, error } = await supabase.from('testimonials').insert([testimonialData]).select();

      if (error) {
        console.error('Error submitting testimonial:', error.message);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in submitTestimonial:', error.message);
      throw error;
    }
  },

  // Function to fetch testimonials for a specific user
  getUserTestimonials: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*, user_profiles(full_name, avatar_url, username)') // Fetch user_profiles data
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user testimonials:', error.message);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getUserTestimonials:', error.message);
      throw error;
    }
  },

  // Function to fetch all testimonials (e.g., for a public testimonials page)
  getAllTestimonials: async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*, user_profiles(full_name, avatar_url, username)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all testimonials:', error.message);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getAllTestimonials:', error.message);
      throw error;
    }
  },
};
