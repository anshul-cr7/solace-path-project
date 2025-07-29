-- Create counselors table
CREATE TABLE public.counselors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  experience_years INTEGER,
  bio TEXT,
  location TEXT,
  availability_schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;

-- Create policy for premium users to view counselors
CREATE POLICY "Premium users can view counselors" 
ON public.counselors 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_premium = true
  )
);

-- Add is_premium column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_premium BOOLEAN DEFAULT false;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_counselors_updated_at
BEFORE UPDATE ON public.counselors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample counselors data
INSERT INTO public.counselors (name, specialization, contact_email, contact_phone, experience_years, bio, location, availability_schedule) VALUES
('Dr. Sarah Johnson', 'Anxiety & Depression', 'sarah.johnson@therapy.com', '+1-555-0123', 8, 'Specializing in cognitive behavioral therapy with focus on anxiety disorders and depression treatment.', 'New York, NY', 'Mon-Fri 9AM-6PM'),
('Dr. Michael Chen', 'Family Therapy', 'michael.chen@counseling.com', '+1-555-0124', 12, 'Expert in family dynamics and relationship counseling with over a decade of experience.', 'Los Angeles, CA', 'Tue-Sat 10AM-7PM'),
('Dr. Emily Rodriguez', 'Trauma & PTSD', 'emily.rodriguez@mentalhealth.com', '+1-555-0125', 10, 'EMDR certified therapist specializing in trauma recovery and PTSD treatment.', 'Chicago, IL', 'Mon-Thu 8AM-5PM'),
('Dr. David Wilson', 'Addiction Recovery', 'david.wilson@recovery.com', '+1-555-0126', 15, 'Licensed addiction counselor with extensive experience in substance abuse recovery programs.', 'Houston, TX', 'Mon-Fri 7AM-4PM'),
('Dr. Lisa Thompson', 'Child Psychology', 'lisa.thompson@childtherapy.com', '+1-555-0127', 9, 'Pediatric psychologist specializing in childhood behavioral issues and developmental concerns.', 'Phoenix, AZ', 'Mon-Wed-Fri 9AM-3PM');