import { supabaseClient } from "../lib/client/supabaseClient";

export const login = (email: string, password: string) => {
  return supabaseClient.auth.signInWithPassword({ email, password });
};

export const register = (email: string, password: string) => {
  return supabaseClient.auth.signUp({ email, password });
};

export const logout = () => {
  return supabaseClient.auth.signOut();
};
