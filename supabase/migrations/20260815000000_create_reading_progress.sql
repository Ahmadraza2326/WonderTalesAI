-- ============================================================================
-- Migration: 20260815000000_create_reading_progress.sql
-- Description: Creates the story_reading_progress table for gentle learning tracking
-- Author: ORBIS Senior Principal Engineer
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.story_reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE SET NULL,
    pages_read INTEGER NOT NULL DEFAULT 1,
    total_pages INTEGER NOT NULL DEFAULT 1,
    reading_time_seconds INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    listened_audio BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT story_reading_progress_user_story_unique UNIQUE (user_id, story_id)
);

-- Indexes for performant parent learning insights queries
CREATE INDEX IF NOT EXISTS idx_story_reading_progress_user_id 
    ON public.story_reading_progress (user_id);

CREATE INDEX IF NOT EXISTS idx_story_reading_progress_user_completed 
    ON public.story_reading_progress (user_id, completed);

CREATE INDEX IF NOT EXISTS idx_story_reading_progress_child 
    ON public.story_reading_progress (child_id);

-- Enable Row Level Security
ALTER TABLE public.story_reading_progress ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Parents can only view their own reading progress
DROP POLICY IF EXISTS "Users can view their own story reading progress" ON public.story_reading_progress;
CREATE POLICY "Users can view their own story reading progress"
    ON public.story_reading_progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- 2. INSERT Policy: Parents can only insert reading progress for themselves
DROP POLICY IF EXISTS "Users can insert their own story reading progress" ON public.story_reading_progress;
CREATE POLICY "Users can insert their own story reading progress"
    ON public.story_reading_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE Policy: Parents can only update their own reading progress
DROP POLICY IF EXISTS "Users can update their own story reading progress" ON public.story_reading_progress;
CREATE POLICY "Users can update their own story reading progress"
    ON public.story_reading_progress
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. DELETE Policy: Parents can only delete their own reading progress
DROP POLICY IF EXISTS "Users can delete their own story reading progress" ON public.story_reading_progress;
CREATE POLICY "Users can delete their own story reading progress"
    ON public.story_reading_progress
    FOR DELETE
    USING (auth.uid() = user_id);

