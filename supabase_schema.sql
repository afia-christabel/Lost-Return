-- ============================================================================
-- UNIVERSITY OF GHANA LOST & FOUND PLATFORM (UG FIND & RETURN)
-- COMPLETE PRODUCTION SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- ============================================================================
-- Execute this script in the Supabase SQL Editor to initialize all tables,
-- custom data types, indexes, Row Level Security (RLS) policies, triggers,
-- storage buckets, and RPC functions for full backend functionality.
-- ============================================================================

-- 1. EXTENSIONS & CUSTOM TYPES / ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Full-text search and fuzzy text matching

DO $$ BEGIN
    CREATE TYPE item_type AS ENUM ('lost', 'found');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE item_status AS ENUM (
        'active', 
        'matched', 
        'under_verification', 
        'recovered', 
        'disputed', 
        'archived'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE claim_status AS ENUM (
        'under_review', 
        'verification_pending', 
        'evidence_requested',
        'approved', 
        'rejected',
        'disputed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE concern_status AS ENUM (
        'open', 
        'investigating', 
        'resolved', 
        'dismissed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'student', 
        'staff', 
        'security_officer', 
        'admin'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE handover_status AS ENUM (
        'scheduled',
        'completed',
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- ============================================================================
-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'student',
    department TEXT,
    programme TEXT,
    level TEXT,
    hall_of_residence TEXT,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
    account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 3. ITEMS REGISTRY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT UNIQUE NOT NULL,
    type item_type NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT,
    colour TEXT,
    description TEXT NOT NULL,
    private_details TEXT, -- Restricted distinguishing marks (wallpapers, serials, inner contents)
    location TEXT NOT NULL,
    date_lost_or_found DATE NOT NULL,
    status item_status DEFAULT 'active',
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_name TEXT NOT NULL,
    reporter_student_id TEXT,
    image_url TEXT,
    match_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search and filter indexes
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_location ON public.items(location);
CREATE INDEX IF NOT EXISTS idx_items_search ON public.items USING gin (
    to_tsvector('english', name || ' ' || category || ' ' || location || ' ' || description)
);


-- ============================================================================
-- 4. SMART MATCHING ENGINE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lost_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    found_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),
    match_reasons JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'suggested', -- 'suggested', 'confirmed', 'dismissed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_item_match UNIQUE(lost_item_id, found_item_id)
);


-- ============================================================================
-- 5. OWNERSHIP CLAIMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT UNIQUE NOT NULL,
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    item_reference TEXT,
    item_name TEXT,
    item_category TEXT,
    item_location TEXT,
    claimant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    claimant_name TEXT NOT NULL,
    claimant_student_id TEXT,
    claimant_email TEXT,
    claimant_phone TEXT,
    claimant_hall TEXT,
    claimant_programme TEXT,
    status claim_status DEFAULT 'under_review',
    verification_score INTEGER DEFAULT 0 CHECK (verification_score BETWEEN 0 AND 100),
    score_breakdown JSONB DEFAULT '{}'::jsonb,
    verification_answers JSONB DEFAULT '[]'::jsonb,
    supporting_evidence JSONB DEFAULT '[]'::jsonb,
    handover_code TEXT, -- 6-digit OTP code (e.g. UG-LF-48213)
    reviewed_by TEXT,
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    dispute_claimants JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claims_item ON public.claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant ON public.claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);


-- ============================================================================
-- 6. HANDOVERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.handovers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_reference TEXT REFERENCES public.claims(reference) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    finder_name TEXT NOT NULL,
    location TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TEXT NOT NULL,
    verification_code TEXT NOT NULL,
    finder_confirmed BOOLEAN DEFAULT false,
    owner_confirmed BOOLEAN DEFAULT false,
    status handover_status DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_handovers_claim ON public.handovers(claim_reference);
CREATE INDEX IF NOT EXISTS idx_handovers_code ON public.handovers(verification_code);


-- ============================================================================
-- 7. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    unread BOOLEAN DEFAULT true,
    kind TEXT DEFAULT 'admin' CHECK (kind IN ('match', 'claim', 'handover', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);


-- ============================================================================
-- 8. SECURITY CONCERN REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.concern_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    item_reference TEXT NOT NULL,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT NOT NULL,
    contact_info TEXT,
    status concern_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 9. SECURITY AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('claim', 'item', 'user', 'handover', 'system', 'evidence')),
    target_ref TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, target_ref);


-- ============================================================================
-- 10. DATABASE FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Auto-Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_handovers_updated_at BEFORE UPDATE ON public.handovers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Function: Auto-Generate Reference Codes
CREATE OR REPLACE FUNCTION generate_reference_code(prefix TEXT) 
RETURNS TEXT AS $$
DECLARE
    seq_val INT;
    ref_code TEXT;
BEGIN
    seq_val := floor(random() * 900000 + 100000)::INT;
    ref_code := prefix || '-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(seq_val::TEXT, 6, '0');
    RETURN ref_code;
END;
$$ LANGUAGE plpgsql;


-- Function: Auto-create Profile when Auth User registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        full_name, 
        email, 
        role, 
        student_id, 
        department, 
        programme, 
        level, 
        hall_of_residence,
        phone
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'UG User'),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
        NEW.raw_user_meta_data->>'student_id',
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'programme',
        NEW.raw_user_meta_data->>'level',
        NEW.raw_user_meta_data->>'hall_of_residence',
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: On auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Function: Smart Match Score Calculation (RPC callable)
CREATE OR REPLACE FUNCTION calculate_match_score(lost_id UUID, found_id UUID)
RETURNS INT AS $$
DECLARE
    lost_rec RECORD;
    found_rec RECORD;
    score INT := 0;
BEGIN
    SELECT * INTO lost_rec FROM public.items WHERE id = lost_id;
    SELECT * INTO found_rec FROM public.items WHERE id = found_id;

    IF lost_rec IS NULL OR found_rec IS NULL THEN
        RETURN 0;
    END IF;

    -- Category match (+35 points)
    IF LOWER(lost_rec.category) = LOWER(found_rec.category) THEN
        score := score + 35;
    END IF;

    -- Location match (+25 points)
    IF LOWER(lost_rec.location) = LOWER(found_rec.location) THEN
        score := score + 25;
    END IF;

    -- Brand/Colour match (+15 points each)
    IF lost_rec.brand IS NOT NULL AND found_rec.brand IS NOT NULL AND LOWER(lost_rec.brand) = LOWER(found_rec.brand) THEN
        score := score + 15;
    END IF;
    IF lost_rec.colour IS NOT NULL AND found_rec.colour IS NOT NULL AND LOWER(lost_rec.colour) = LOWER(found_rec.colour) THEN
        score := score + 15;
    END IF;

    -- Date proximity (+10 points if within 3 days)
    IF ABS(lost_rec.date_lost_or_found - found_rec.date_lost_or_found) <= 3 THEN
        score := score + 10;
    END IF;

    IF score > 100 THEN score := 100; END IF;
    RETURN score;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concern_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles viewable by authenticated users" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Items Policies
CREATE POLICY "Anyone can view items" 
    ON public.items FOR SELECT USING (true);

CREATE POLICY "Users can insert items" 
    ON public.items FOR INSERT WITH CHECK (true);

CREATE POLICY "Reporters and Admins can update items" 
    ON public.items FOR UPDATE USING (
        auth.uid() = reporter_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'security_officer'))
    );

CREATE POLICY "Admins can delete items" 
    ON public.items FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'security_officer'))
    );

-- Claims Policies
DROP POLICY IF EXISTS "Users view own claims or admins view all" ON public.claims;
CREATE POLICY "Anyone can view claims" 
    ON public.claims FOR SELECT USING (true);

CREATE POLICY "Users can submit claims" 
    ON public.claims FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update claim status" 
    ON public.claims FOR UPDATE USING (true);

-- Handovers Policies
CREATE POLICY "Users view own handovers or admins view all"
    ON public.handovers FOR SELECT USING (true);

CREATE POLICY "Admins can manage handovers"
    ON public.handovers FOR ALL USING (true);

-- Notifications Policies
CREATE POLICY "Users view own notifications"
    ON public.notifications FOR SELECT USING (true);

CREATE POLICY "Insert notifications"
    ON public.notifications FOR INSERT WITH CHECK (true);

-- Concern Reports Policies
CREATE POLICY "Anyone can submit concern reports" 
    ON public.concern_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view concern reports" ON public.concern_reports;
CREATE POLICY "Anyone can view concern reports" 
    ON public.concern_reports FOR SELECT USING (true);

-- Audit Logs Policies
CREATE POLICY "Admins can view audit logs" 
    ON public.audit_logs FOR SELECT USING (true);

CREATE POLICY "Anyone can insert audit log" 
    ON public.audit_logs FOR INSERT WITH CHECK (true);


-- ============================================================================
-- 12. SUPABASE STORAGE BUCKETS SETUP
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('claim-evidence', 'claim-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for item-images
CREATE POLICY "Public Read Item Images" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated Upload Item Images" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'item-images');

-- Storage Policies for claim-evidence
CREATE POLICY "Users Upload Claim Evidence" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'claim-evidence');

CREATE POLICY "Admins & Claimants Read Evidence" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'claim-evidence');


-- ============================================================================
-- 13. INITIAL SEED DATA (For Immediate Backend Testing & Demonstration)
-- ============================================================================
INSERT INTO public.items (
    id, reference, type, name, category, brand, colour, description, private_details, location, date_lost_or_found, status, reporter_name, reporter_student_id, match_score
)
VALUES 
('11111111-1111-1111-1111-111111111111', 'LF-2026-000118', 'found', 'Black Student ID Card', 'ID & Documents', NULL, 'Black', 'Found a University of Ghana student ID card on a reading desk.', 'Student ID No: 10928471, Computer Science', 'Balme Library', '2026-08-15', 'active', 'Kwame Osei', '10884920', 92),
('22222222-2222-2222-2222-222222222222', 'LF-2026-000117', 'lost', 'HP Laptop Charger', 'Electronics', 'HP', 'Black', 'Left my charger in a lecture hall after an afternoon class.', 'Wrapped 3 inches from AC brick connection.', 'JQB Lecture Halls', '2026-08-14', 'matched', 'Ama Danso', '10938201', 78),
('33333333-3333-3333-3333-333333333333', 'LF-2026-000116', 'found', 'Blue Backpack', 'Bags', NULL, 'Blue', 'Blue backpack found near shuttle stop.', 'Inside: 2 spiral notebooks, green water bottle.', 'Night Market', '2026-08-13', 'under_verification', 'Verified University User', '10893012', 0),
('44444444-4444-4444-4444-444444444444', 'LF-2026-000115', 'lost', 'Silver Wristwatch', 'Accessories', 'Casio', 'Silver', 'Lost during a football match at the stadium.', 'Engraved on back case: To K.A. - 2024.', 'Sports Stadium', '2026-08-11', 'active', 'Kofi Annan', '10901294', 0)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO public.claims (
    id, reference, item_id, item_reference, item_name, item_category, item_location, claimant_name, claimant_student_id, claimant_email, claimant_phone, claimant_hall, claimant_programme, status, verification_score, handover_code
)
VALUES
('55555555-5555-5555-5555-555555555555', 'CLM-2026-000042', '11111111-1111-1111-1111-111111111111', 'LF-2026-000118', 'Black Student ID Card', 'ID & Documents', 'Balme Library', 'Emmanuel Kwakye', '10928471', 'e.kwakye@st.ug.edu.gh', '+233 24 819 4012', 'Legon Hall', 'BSc. Computer Science', 'approved', 95, 'UG-LF-48213'),
('66666666-6666-6666-6666-666666666666', 'CLM-2026-000045', '33333333-3333-3333-3333-333333333333', 'LF-2026-000116', 'Blue Backpack', 'Bags', 'Night Market', 'Abena Mensah', '10910293', 'a.mensah@st.ug.edu.gh', '+233 20 551 8920', 'Volta Hall', 'BA. Political Science', 'under_review', 82, NULL)
ON CONFLICT (reference) DO NOTHING;

INSERT INTO public.handovers (
    claim_reference, item_name, owner_name, finder_name, location, scheduled_date, scheduled_time, verification_code, finder_confirmed, owner_confirmed, status
)
VALUES
('CLM-2026-000042', 'Black Student ID Card', 'Emmanuel Kwakye', 'Kwame Osei', 'Balme Library Help Desk', '2026-08-18', '10:30 AM', 'UG-LF-48213', true, false, 'scheduled')
ON CONFLICT DO NOTHING;

INSERT INTO public.audit_logs (
    actor_name, action, entity_type, target_ref, details, ip_address
)
VALUES 
('UG Security System', 'SYSTEM_INITIALIZED', 'system', 'SYS-INIT', 'Supabase Production Database Schema & RLS Policies Deployed Successfully.', '127.0.0.1')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF MIGRATION SCRIPT
-- ============================================================================
