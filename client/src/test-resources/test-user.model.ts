import { Builder } from 'builder-pattern';
import { User } from '../app/models/user.model';

/**
 * Test User Factory
 * Creates User objects for testing with the new isAdmin boolean field
 * Uses the builder pattern for flexible object construction
 */
export class TestUser {
  /**
   * Creates a basic test user with default values.
   * username: "testuser"
   * email: "test@example.com"
   * isAdmin: false
   */
  static createUser(overrides?: Partial<User>): User {
    const baseUser = Builder<User>()
      .id('1')
      .username('testuser')
      .email('test@example.com')
      .firstName('Test')
      .lastName('User')
      .isAdmin(false)
      .build();
    
    return {
      ...baseUser,
      ...overrides
    };
  }
}
