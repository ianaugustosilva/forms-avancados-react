import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	"https://tbvjdfdfjulxjmzdgcil.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRidmpkZmRmanVseGptemRnY2lsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTE5MDEzNCwiZXhwIjoxOTk2NzY2MTM0fQ._i6s-rcfMWE0DqqT0oA1MeBJYY9Um4SejhO2lLUVBC0"
);
