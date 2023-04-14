import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	"https://ufxqfulfiomjlpqmbhuw.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmeHFmdWxmaW9tamxwcW1iaHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1MDAzMjcsImV4cCI6MTk5NzA3NjMyN30.tzkrcqL9g7f69oM8LvfabYklo5S8-XQkS4xQ60RTE9Y"
);
