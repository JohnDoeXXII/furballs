package org.furballs.security;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.furballs.domain.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/**
 * Aspect that intercepts methods annotated with @AdminOnly
 * and verifies the current user has admin role.
 */
@Aspect
@Component
public class AdminOnlyAspect {

  @Autowired
  private AuthenticationContext authenticationContext;

  /**
   * Before advice that executes before any method annotated with @AdminOnly.
   * Throws 403 Forbidden if user is not authenticated or not an admin.
   */
  @Before("@annotation(AdminOnly)")
  public void checkAdminRole() {
    User currentUser = authenticationContext.getCurrentUser();
    
    if (currentUser == null) {
      throw new ResponseStatusException(
        HttpStatus.FORBIDDEN, 
        "Authentication required"
      );
    }
    
    if (!currentUser.isAdmin()) {
      throw new ResponseStatusException(
        HttpStatus.FORBIDDEN, 
        "Admin role required"
      );
    }
  }
}
