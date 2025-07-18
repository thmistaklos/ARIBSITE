-- Create the faq_items table
    CREATE TABLE public.faq_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      order_index INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable Row Level Security (RLS) for the faq_items table
    ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

    -- Create a policy to allow authenticated users to insert new FAQ items
    CREATE POLICY "Allow authenticated users to insert FAQ items"
    ON public.faq_items FOR INSERT
    TO authenticated
    WITH CHECK (true);

    -- Create a policy to allow authenticated users to update FAQ items
    CREATE POLICY "Allow authenticated users to update FAQ items"
    ON public.faq_items FOR UPDATE
    TO authenticated
    USING (true);

    -- Create a policy to allow authenticated users to delete FAQ items
    CREATE POLICY "Allow authenticated users to delete FAQ items"
    ON public.faq_items FOR DELETE
    TO authenticated
    USING (true);

    -- Create a policy to allow all users to read FAQ items (public display)
    CREATE POLICY "Allow all users to read FAQ items"
    ON public.faq_items FOR SELECT
    TO public
    USING (true);