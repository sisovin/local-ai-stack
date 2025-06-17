# Local AI Stack - Futuristic Frontend Setup

A complete React/Next.js frontend with green accents, glassmorphism, neon effects, and animations that connects to Open Web UI for local LLM interactions.

## 🚀 Features

- **Futuristic Design**: Green accent colors, glassmorphism effects, neon borders, and smooth animations
- **Authentication**: Secure user authentication with Supabase
- **Real-time Chat**: Live chat interface with local AI models
- **Model Selection**: Support for multiple LLM models (DeepSeek R1, Qwen 3, etc.)
- **Chat History**: Persistent conversation storage with Supabase
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Privacy-First**: All AI processing happens locally on your infrastructure

## 🛠️ Prerequisites

Before setting up the frontend, ensure you have:

1. **Local AI Infrastructure** running:
   - Ollama with models pulled (DeepSeek R1, Qwen 3, etc.)
   - Open Web UI running on port 3000
   - FastAPI backend (optional)

2. **Supabase Project**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Note your project URL and anon key

3. **Node.js 18+** and **pnpm** installed

## 📦 Installation

1. **Install Dependencies**:
   ```bash
   cd apps/web
   pnpm install
   ```

2. **Set up Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
   # Open Web UI Configuration
   NEXT_PUBLIC_OPENWEBUI_URL=http://localhost:3000
   NEXT_PUBLIC_OPENWEBUI_API_KEY=optional-api-key
   
   # Optional: Additional AI Services
   NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
   NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
   ```

3. **Set up Supabase Database**:
   
   a. Go to your Supabase project dashboard
   
   b. Navigate to the SQL Editor
   
   c. Run the schema from `docs/supabase-schema.sql`
   
   d. This will create the necessary tables and security policies

## 🗄️ Database Schema

The following tables are created in your Supabase database:

### `profiles`
Stores user profile information:
- `id` (UUID) - Links to auth.users
- `email` (TEXT) - User email
- `full_name` (TEXT) - User's full name
- `avatar_url` (TEXT) - Profile picture URL
- Timestamps

### `chat_messages`
Stores all chat interactions:
- `id` (UUID) - Unique message ID
- `user_id` (UUID) - Links to auth.users
- `message` (TEXT) - User's message
- `response` (TEXT) - AI's response
- `model` (TEXT) - AI model used
- `session_id` (UUID) - Optional grouping
- Configuration and metadata
- Timestamps

### `conversation_sessions`
Groups related messages:
- `id` (UUID) - Session ID
- `user_id` (UUID) - Links to auth.users
- `title` (TEXT) - Conversation title
- `model` (TEXT) - Default model for session
- Statistics and metadata
- Timestamps

## 🔧 Configuration

### Supabase Setup

1. **Authentication**:
   - Email/password authentication is enabled by default
   - Users are automatically created in the `profiles` table
   - Row Level Security (RLS) ensures data privacy

2. **Real-time Subscriptions**:
   - The app subscribes to chat message changes
   - Updates appear instantly across all connected clients

3. **Security Policies**:
   - Users can only access their own data
   - All queries are secured with RLS policies

### Open Web UI Integration

The frontend connects to Open Web UI through its REST API:

- **Chat Completions**: `/api/chat/completions`
- **Model List**: `/api/models`
- **Streaming**: WebSocket support for real-time responses

## 🎨 Design System

### Color Scheme
- **Primary Green**: `oklch(0.70 0.25 145)` - Neon green accents
- **Electric Blue**: `oklch(0.70 0.25 220)` - Secondary highlights
- **Cyber Purple**: `oklch(0.65 0.25 280)` - Tertiary accents
- **Tech Gray**: `oklch(0.20 0.02 220)` - Background elements

### Effects
- **Glassmorphism**: Translucent cards with backdrop blur
- **Neon Borders**: Glowing borders on interactive elements
- **Animations**: Smooth transitions and hover effects
- **Circuit Patterns**: Subtle background grid patterns

## 🚀 Running the Application

1. **Start the Development Server**:
   ```bash
   cd apps/web
   pnpm dev
   ```

2. **Access the Application**:
   - Open [http://localhost:3001](http://localhost:3001)
   - Create an account or sign in
   - Start chatting with your local AI models

## 🔄 Usage Flow

1. **Authentication**:
   - Users sign up/sign in with email and password
   - Profile is automatically created in Supabase

2. **Chat Interface**:
   - Select AI model from dropdown
   - Adjust temperature and max tokens
   - Send messages and receive real-time responses
   - Chat history is automatically saved

3. **Model Management**:
   - Models are fetched from Open Web UI
   - Switch between different LLMs seamlessly
   - Configure generation parameters per conversation

## 🔐 Security Features

- **Local Processing**: All AI inference happens on your hardware
- **Encrypted Storage**: Supabase handles encryption at rest
- **Row Level Security**: Database access is strictly controlled
- **No Third-party APIs**: No external AI service calls
- **HTTPS Support**: Use SSL certificates in production

## 🎯 Advanced Features

### Chat Management
- **Session Grouping**: Organize conversations by topic
- **Message Search**: Find specific conversations
- **Export/Import**: Backup and restore chat history
- **Conversation Templates**: Pre-defined system prompts

### Model Configuration
- **Parameter Tuning**: Adjust temperature, top-p, etc.
- **Custom Prompts**: Set system prompts per conversation
- **Model Comparison**: A/B test different models
- **Performance Metrics**: Track response times and token usage

### Real-time Features
- **Live Typing**: See messages as they're generated
- **Presence Indicators**: Show when AI is processing
- **Auto-save**: Conversations saved automatically
- **Offline Support**: Cache for offline viewing

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**:
   - Verify your environment variables
   - Check project URL and anon key
   - Ensure database schema is applied

2. **Open Web UI Not Connecting**:
   - Confirm Open Web UI is running
   - Check the URL in environment variables
   - Verify CORS settings if needed

3. **Models Not Loading**:
   - Ensure Ollama is running with models pulled
   - Check Open Web UI model list endpoint
   - Verify network connectivity

4. **Authentication Issues**:
   - Check Supabase auth configuration
   - Verify email settings if using email auth
   - Review RLS policies for access issues

### Development Tips

1. **Hot Reload**: The app supports hot reload for rapid development
2. **Error Boundaries**: Errors are caught and displayed gracefully
3. **Logging**: Check browser console for detailed error messages
4. **Network Tab**: Monitor API calls in browser dev tools

## 📚 Component Architecture

### Core Components

- **`Authentication.tsx`**: Handles user sign-up/sign-in
- **`ChatInterface.tsx`**: Main chat interface with real-time messaging
- **`Navigation.tsx`**: Responsive navigation component
- **`utils/supabaseClient.ts`**: Supabase integration and API calls

### UI Components (from @workspace/ui)

All UI components use the futuristic design system:
- Glassmorphic cards and containers
- Neon-accented buttons and inputs
- Animated progress indicators
- Responsive layout components

## 🎉 What's Included

✅ **Complete Authentication System**
✅ **Real-time Chat Interface** 
✅ **Supabase Database Integration**
✅ **Open Web UI Connectivity**
✅ **Responsive Design System**
✅ **Futuristic UI with Animations**
✅ **Chat History Persistence**
✅ **Model Selection & Configuration**
✅ **Session Management**
✅ **Security & Privacy Features**

## 🚀 Next Steps

1. **Customize Design**: Modify colors and animations to match your brand
2. **Add Features**: Implement file uploads, voice chat, or custom models
3. **Deploy**: Set up production deployment with Vercel or similar
4. **Scale**: Add Redis caching and load balancing for multiple users
5. **Extend**: Integrate with additional AI services and tools

Your local AI stack frontend is now ready for production use! 🎊
