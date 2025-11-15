package org.furballs.security;

import org.furballs.domain.user.User;
import org.springframework.stereotype.Service;

/**
 * Service that holds the currently authenticated User in a ThreadLocal.
 * This allows access to the authenticated user throughout the request lifecycle.
 */
@Service
public class AuthenticationContext {

  private static final ThreadLocal<User> currentUser = new ThreadLocal<>();

  /**
   * Gets the currently authenticated user for this thread.
   * @return the current User, or null if no user is authenticated
   */
  public User getCurrentUser() {
    return currentUser.get();
  }

  /**
   * Sets the currently authenticated user for this thread.
   * @param user the User to set as current
   */
  public void setCurrentUser(User user) {
    currentUser.set(user);
  }

  /**
   * Clears the current user from the ThreadLocal.
   * Should be called at the end of request processing to prevent memory leaks.
   */
  public void clear() {
    currentUser.remove();
  }
}
