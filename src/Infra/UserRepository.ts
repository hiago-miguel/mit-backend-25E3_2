import { User, CreateUserRequest } from '../Domain/index';

export class UserRepository {
  private static instance: UserRepository;
  private users: User[] = [];

  private constructor() {
    // Admin hardcoded para simplificar
    this.users.push({
      id: 'admin-001',
      username: 'admin',
      email: 'admin@infnet.edu.br',
      password: '$2a$12$kUOdc7Ehki0cNkDScCNhrec3KRxpaJnV5foZgbSblnRsAuOP4pfTa', // admin123
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      role: userData.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(user => ({
      ...user,
      password: undefined
    }));
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    return this.users[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  // Método para testes - limpa todos os usuários exceto o admin
  clearTestData(): void {
    this.users = this.users.filter(user => user.role === 'admin');
  }
}
