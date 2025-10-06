// src/storage/supabaseStorage.js
import { supabase } from "../lib/supabase";

export const supabaseStorage = {
  getInterns: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("interns")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching interns:", error.message);
      return [];
    }
  },

  saveIntern: async (intern) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const internData = { ...intern, user_id: user.id };

      if (intern.id) {
        const { data, error } = await supabase
          .from("interns")
          .update(internData)
          .eq("id", intern.id)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        delete internData.id;
        const { data, error } = await supabase
          .from("interns")
          .insert([internData])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error("❌ Error saving intern:", error.message);
      throw error;
    }
  },

  deleteIntern: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("interns")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("❌ Error deleting intern:", error.message);
      throw error;
    }
  },

  getLetters: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("letter_history")
        .select(`
          *,
          interns (
            id,
            name,
            email,
            position
          )
        `)
        .eq("user_id", user.id)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching letters:", error.message);
      return [];
    }
  },

  saveLetter: async (letter) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const letterData = {
        user_id: user.id,
        intern_id: letter.internId,
        letter_type: letter.type,
        recipient_email: letter.recipientEmail,
        status: letter.status || "sent",
      };

      const { data, error } = await supabase
        .from("letter_history")
        .insert([letterData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("❌ Error saving letter:", error.message);
      throw error;
    }
  },

  getLettersByIntern: async (internId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("letter_history")
        .select("*")
        .eq("user_id", user.id)
        .eq("intern_id", internId)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching letters by intern:", error.message);
      return [];
    }
  },
};
