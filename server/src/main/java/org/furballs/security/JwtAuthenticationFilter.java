package org.furballs.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.furballs.domain.user.User;
import org.furballs.domain.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * Filter that extracts and validates JWT tokens from requests,
 * then populates the AuthenticationContext with the authenticated user.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final Logger logger = Logger.getLogger(JwtAuthenticationFilter.class.getName());

  @Autowired
  private JwtService jwtService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AuthenticationContext authenticationContext;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    try {
      String authorizationHeader = request.getHeader("Authorization");

      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        String token = authorizationHeader.substring(7);

        try {
          // Extract user ID from token
          UUID userId = jwtService.extractUserId(token);
          String username = jwtService.extractUsername(token);

          // Validate token
          if (jwtService.validateToken(token, username)) {
            // Load user from database
            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isPresent()) {
              authenticationContext.setCurrentUser(userOptional.get());
              logger.fine("Authenticated user: " + username);
            } else {
              logger.warning("Token valid but user not found: " + userId);
            }
          } else {
            logger.warning("Invalid or expired token for user: " + username);
          }
        } catch (Exception e) {
          logger.warning("Error processing JWT token: " + e.getMessage());
        }
      }

      // Continue filter chain
      filterChain.doFilter(request, response);
    } finally {
      // Clear ThreadLocal to prevent memory leaks
      authenticationContext.clear();
    }
  }
}
