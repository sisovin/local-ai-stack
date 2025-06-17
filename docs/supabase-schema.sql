-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table for storing conversations
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'deepseek-r1:7b',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_sessions table for grouping related messages
CREATE TABLE conversation_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  model TEXT NOT NULL DEFAULT 'deepseek-r1:7b',
  system_prompt TEXT,
  message_count INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add session_id to chat_messages (optional for grouping)
ALTER TABLE chat_messages 
ADD COLUMN session_id UUID REFERENCES conversation_sessions(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_conversation_sessions_user_id ON conversation_sessions(user_id);
CREATE INDEX idx_conversation_sessions_created_at ON conversation_sessions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat messages" ON chat_messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" ON chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for conversation_sessions
CREATE POLICY "Users can view their own conversation sessions" ON conversation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversation sessions" ON conversation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation sessions" ON conversation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversation sessions" ON conversation_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER chat_messages_updated_at
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER conversation_sessions_updated_at
  BEFORE UPDATE ON conversation_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update session statistics
CREATE OR REPLACE FUNCTION public.update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update message count and total tokens for the session
  IF NEW.session_id IS NOT NULL THEN
    UPDATE conversation_sessions 
    SET 
      message_count = (
        SELECT COUNT(*) 
        FROM chat_messages 
        WHERE session_id = NEW.session_id
      ),
      total_tokens = (
        SELECT COALESCE(SUM(tokens_used), 0) 
        FROM chat_messages 
        WHERE session_id = NEW.session_id
      ),
      updated_at = NOW()
    WHERE id = NEW.session_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update session stats when messages are added
CREATE TRIGGER update_session_stats_trigger
  AFTER INSERT OR UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_session_stats();

-- Create view for conversation summaries
CREATE OR REPLACE VIEW conversation_summaries AS
SELECT 
  cs.id,
  cs.user_id,
  cs.title,
  cs.model,
  cs.message_count,
  cs.total_tokens,
  cs.created_at,
  cs.updated_at,
  -- Get the first message as preview
  (
    SELECT cm.message 
    FROM chat_messages cm 
    WHERE cm.session_id = cs.id 
    ORDER BY cm.created_at ASC 
    LIMIT 1
  ) as first_message_preview,
  -- Get the last activity time
  (
    SELECT cm.created_at 
    FROM chat_messages cm 
    WHERE cm.session_id = cs.id 
    ORDER BY cm.created_at DESC 
    LIMIT 1
  ) as last_activity
FROM conversation_sessions cs;

-- Grant necessary permissions for authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON chat_messages TO authenticated;
GRANT ALL ON conversation_sessions TO authenticated;
GRANT SELECT ON conversation_summaries TO authenticated;

-- Grant permissions for the service role (for admin operations)
GRANT ALL ON profiles TO service_role;
GRANT ALL ON chat_messages TO service_role;
GRANT ALL ON conversation_sessions TO service_role;
GRANT SELECT ON conversation_summaries TO service_role;

-- Insert some sample data (optional - remove in production)
-- This creates a test conversation session for demonstration
-- Note: Replace the user_id with an actual user ID from your auth.users table

/*
-- Example usage after creating a user:
INSERT INTO conversation_sessions (user_id, title, model) 
VALUES ('your-user-id-here', 'Welcome Conversation', 'deepseek-r1:7b');

INSERT INTO chat_messages (user_id, session_id, message, response, model, tokens_used) 
VALUES (
  'your-user-id-here',
  (SELECT id FROM conversation_sessions WHERE title = 'Welcome Conversation'),
  'Hello! How does this local AI setup work?',
  'Welcome to your local AI stack! This setup allows you to run powerful AI models locally while maintaining privacy and control over your data.',
  'deepseek-r1:7b',
  150
);
*/
