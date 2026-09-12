-- ============================================================================
-- ORBis Academy Learning Mastery & Mission Progress Persistence
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.child_academy_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  mastery_level TEXT NOT NULL DEFAULT 'learning',
  mastery_score INTEGER NOT NULL DEFAULT 0,
  attempts_count INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  hints_used_count INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_child_academy_skill UNIQUE (child_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_mastery_child ON public.child_academy_mastery(child_id);
CREATE INDEX IF NOT EXISTS idx_academy_mastery_subject ON public.child_academy_mastery(child_id, subject_id);

-- Enable RLS
ALTER TABLE public.child_academy_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can read their children's academy mastery"
  ON public.child_academy_mastery
  FOR SELECT
  TO authenticated
  USING (
    child_id IN (
      SELECT id FROM public.child_profiles WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update their children's academy mastery"
  ON public.child_academy_mastery
  FOR ALL
  TO authenticated
  USING (
    child_id IN (
      SELECT id FROM public.child_profiles WHERE parent_id = auth.uid()
    )
  );
