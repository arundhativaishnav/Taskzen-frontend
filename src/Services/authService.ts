import { User } from '../components/context/AuthContext';

const STORAGE_KEY = 'auth_user';

// Mock user data for demo purposes
const DEMO_USERS = [
  { id: '1', name: 'Demo User', email: 'demo@eisenflow.com', password: 'demo123' },
];

class AuthService {
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = localStorage.getItem(STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async signIn(email: string, password: string): Promise<User | null> {
    try {
      // Check demo users first
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (demoUser) {
        const userData: User = {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        return userData;
      }

      // In a real app, this would make an API call to your backend
      // For now, we'll simulate a backend call with stored users
      const storedUsers = this.getStoredUsers();
      const user = storedUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const userData: User = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        return userData;
      }

      return null;
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
    }
  }

  async signUp(name: string, email: string, password: string): Promise<User | null> {
    try {
      // Check if user already exists
      const storedUsers = this.getStoredUsers();
      const existingUser = storedUsers.find(u => u.email === email);
      
      if (existingUser) {
        return null; // User already exists
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      // Store user (in a real app, this would be sent to your backend)
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('stored_users', JSON.stringify(updatedUsers));

      // Set as current user
      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Sign up error:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  private getStoredUsers(): any[] {
    try {
      const users = localStorage.getItem('stored_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      return [];
    }
  }
}

export const authService = new AuthService();