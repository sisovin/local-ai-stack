# LocalAI Stack - NestJS API

A robust, production-ready NestJS API backend for the LocalAI Stack project, featuring TypeScript strict mode, Supabase integration, and comprehensive authentication.

## 🚀 Features

- **NestJS Framework**: Modern, scalable Node.js server-side application framework
- **TypeScript Strict Mode**: Full type safety and compile-time error checking
- **Supabase Integration**: Database operations, real-time subscriptions, and auth
- **JWT Authentication**: Secure token-based authentication with Supabase Auth
- **Role-Based Access Control**: Fine-grained permissions for different user types
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Health Monitoring**: Built-in health checks and metrics endpoints
- **Validation**: Request/response validation with class-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Structured logging with configurable levels
- **Testing**: Comprehensive unit and integration tests
- **Rate Limiting**: Protection against abuse and DDoS attacks

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── app.module.ts              # Root application module
│   ├── main.ts                    # Application entry point
│   ├── auth/                      # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── users/                     # User management module
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── ai/                        # AI services module
│   │   ├── ai.module.ts
│   │   ├── ai.service.ts
│   │   ├── ai.controller.ts
│   │   ├── ollama/
│   │   │   ├── ollama.service.ts
│   │   │   └── ollama.dto.ts
│   │   └── openai/
│   │       ├── openai.service.ts
│   │       └── openai.dto.ts
│   ├── search/                    # Search services module
│   │   ├── search.module.ts
│   │   ├── search.service.ts
│   │   ├── search.controller.ts
│   │   └── dto/
│   │       └── search-query.dto.ts
│   ├── chat/                      # Chat functionality module
│   │   ├── chat.module.ts
│   │   ├── chat.service.ts
│   │   ├── chat.controller.ts
│   │   ├── chat.gateway.ts        # WebSocket gateway
│   │   ├── dto/
│   │   │   ├── chat-message.dto.ts
│   │   │   └── chat-room.dto.ts
│   │   └── entities/
│   │       ├── chat-room.entity.ts
│   │       └── chat-message.entity.ts
│   ├── models/                    # AI model management
│   │   ├── models.module.ts
│   │   ├── models.service.ts
│   │   ├── models.controller.ts
│   │   └── dto/
│   │       └── model-config.dto.ts
│   ├── health/                    # Health check module
│   │   ├── health.module.ts
│   │   ├── health.controller.ts
│   │   └── health.service.ts
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── guards/
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── utils/
│   ├── config/                    # Configuration
│   │   ├── database.config.ts
│   │   ├── auth.config.ts
│   │   ├── api.config.ts
│   │   └── validation.schema.ts
│   └── database/                  # Database utilities
│       ├── database.module.ts
│       ├── supabase.service.ts
│       └── migrations/
├── test/                          # Test files
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .env
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18.x or higher
- pnpm (package manager)
- Docker & Docker Compose
- Supabase account and project

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# API Configuration
PORT=3001
NODE_ENV=development
API_PREFIX=api/v1

# AI Services
OLLAMA_BASE_URL=http://localhost:11434
OPENWEBUI_BASE_URL=http://localhost:3000
AI_SEARCH_AGENT_URL=http://localhost:8000

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=debug
```

### Installation

1. **Install dependencies:**
   ```bash
   cd apps/api
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start the development server:**
   ```bash
   pnpm start:dev
   ```

4. **Run with Docker:**
   ```bash
   docker-compose up -d
   ```

## 🔧 Development

### Scripts

```bash
# Development
pnpm start:dev          # Start in development mode with hot reload
pnpm start:debug        # Start in debug mode
pnpm start:prod         # Start in production mode

# Building
pnpm build              # Build the application
pnpm prebuild           # Clean build directory

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run tests with coverage
pnpm test:e2e           # Run end-to-end tests

# Linting & Formatting
pnpm lint               # Lint code
pnpm lint:fix           # Fix linting issues
pnpm format             # Format code with Prettier

# Database
pnpm migration:generate # Generate new migration
pnpm migration:run      # Run migrations
pnpm migration:revert   # Revert last migration
```

### TypeScript Configuration

The project uses strict TypeScript configuration for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## 🔐 Authentication & Authorization

### JWT Authentication Flow

1. **User Registration/Login**: Users authenticate via Supabase Auth
2. **Token Generation**: JWT tokens are generated with user claims
3. **Token Validation**: Protected routes validate JWT tokens
4. **Role-Based Access**: Different roles have different permissions

### Guards & Decorators

```typescript
// Protect routes with JWT authentication
@UseGuards(JwtAuthGuard)
@Controller('protected')
export class ProtectedController {}

// Require specific roles
@Roles('admin', 'moderator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Post('admin-only')
adminOnlyEndpoint() {}

// Get current user
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user;
}
```

## 🗄️ Database Integration

### Supabase Service

The `SupabaseService` provides a centralized way to interact with Supabase:

```typescript
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async findUser(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new NotFoundException('User not found');
    return data;
  }
}
```

### Query Builder Pattern

```typescript
// Type-safe database queries
const users = await this.supabase
  .from('users')
  .select(`
    id,
    email,
    profile:profiles(*)
  `)
  .eq('active', true)
  .order('created_at', { ascending: false });
```

## 🤖 AI Services Integration

### Ollama Integration

```typescript
@Injectable()
export class OllamaService {
  async generateCompletion(prompt: string, model: string): Promise<string> {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false })
    });
    
    const data = await response.json();
    return data.response;
  }

  async listModels(): Promise<Model[]> {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    return data.models;
  }
}
```

### Chat WebSocket Gateway

```typescript
@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN?.split(',') }
})
export class ChatGateway {
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: ChatMessageDto,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    // Process message with AI
    const response = await this.aiService.generateResponse(data.message);
    
    // Broadcast to room
    this.server.to(data.roomId).emit('messageReceived', {
      ...data,
      response,
      timestamp: new Date()
    });
  }
}
```

## 📊 API Documentation

### Swagger/OpenAPI

The API automatically generates documentation accessible at `/api/docs`:

```typescript
// Enable Swagger in main.ts
const config = new DocumentBuilder()
  .setTitle('LocalAI Stack API')
  .setDescription('Comprehensive AI-powered local stack API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### DTO Documentation

```typescript
export class CreateChatMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Chat room ID' })
  @IsUUID()
  roomId: string;

  @ApiProperty({ description: 'AI model to use', required: false })
  @IsOptional()
  @IsString()
  model?: string;
}
```

## 🔍 Health Monitoring

### Health Check Endpoints

```typescript
@Controller('health')
export class HealthController {
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.supabaseHealth.isHealthy('database'),
      () => this.ollamaHealth.isHealthy('ollama'),
      () => this.diskHealth.checkStorage('storage', { threshold: 250 * 1024 * 1024 * 1024 })
    ]);
  }
}
```

### Metrics Collection

- Response time monitoring
- Request rate tracking
- Error rate analysis
- Database connection health
- AI service availability

## 🛡️ Security Features

### Rate Limiting

```typescript
// Global rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));

// Route-specific limiting
@Throttle(10, 60) // 10 requests per minute
@Post('upload')
uploadFile() {}
```

### Input Validation

```typescript
// Request validation with class-validator
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number'
  })
  password: string;
}
```

### CORS Configuration

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

## 🧪 Testing

### Unit Tests

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user credentials', async () => {
    const result = await service.validateUser('test@example.com', 'password');
    expect(result).toBeDefined();
  });
});
```

### E2E Tests

```typescript
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });
});
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main"]
```

### Environment-Specific Configurations

- **Development**: Hot reload, debug logging, relaxed CORS
- **Staging**: Production-like environment for testing
- **Production**: Optimized builds, security headers, rate limiting

## 📈 Performance Optimization

### Caching Strategy

```typescript
// Redis caching for frequently accessed data
@Injectable()
export class CacheService {
  @Cacheable('users', 300) // Cache for 5 minutes
  async getUser(id: string): Promise<User> {
    return this.supabaseService.findUser(id);
  }
}
```

### Database Optimization

- Connection pooling
- Query optimization
- Index utilization
- Read replicas for scaling

### Memory Management

- Streaming for large responses
- Pagination for list endpoints
- Connection pool tuning

## 🔧 Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify environment variables
   - Check network connectivity
   - Validate API keys

2. **JWT Token Issues**
   - Ensure proper secret configuration
   - Check token expiration
   - Validate token format

3. **AI Service Connectivity**
   - Verify Ollama is running
   - Check service URLs
   - Test with curl/Postman

### Debug Commands

```bash
# Enable debug logging
NODE_ENV=development LOG_LEVEL=debug pnpm start:dev

# Test specific endpoints
curl -X GET http://localhost:3001/api/v1/health

# Check database connectivity
pnpm run test:db-connection
```

## 🤝 Contributing

1. Follow TypeScript strict mode guidelines
2. Write comprehensive tests for new features
3. Document API endpoints with Swagger decorators
4. Follow NestJS best practices and conventions
5. Ensure all services have proper error handling

## 📝 License

This project is part of the LocalAI Stack and follows the same licensing terms.

---

For more information about the overall LocalAI Stack project, see the [main README](../../README.md).
