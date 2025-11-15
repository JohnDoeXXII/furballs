package org.furballs.security;

import org.furballs.domain.user.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

class AuthenticationContextTest {

  private AuthenticationContext authenticationContext;

  @BeforeEach
  void setUp() {
    authenticationContext = new AuthenticationContext();
  }

  @AfterEach
  void tearDown() {
    // Clean up ThreadLocal to prevent memory leaks in tests
    authenticationContext.clear();
  }

  @Test
  void testGetCurrentUser_whenNoUserSet_returnsNull() {
    assertNull(authenticationContext.getCurrentUser());
  }

  @Test
  void testSetAndGetCurrentUser_returnsCorrectUser() {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setUsername("testuser");
    user.setEmail("test@example.com");

    authenticationContext.setCurrentUser(user);

    User retrieved = authenticationContext.getCurrentUser();
    assertNotNull(retrieved);
    assertEquals(user.getId(), retrieved.getId());
    assertEquals(user.getUsername(), retrieved.getUsername());
    assertEquals(user.getEmail(), retrieved.getEmail());
  }

  @Test
  void testClear_removesCurrentUser() {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setUsername("testuser");

    authenticationContext.setCurrentUser(user);
    assertNotNull(authenticationContext.getCurrentUser());

    authenticationContext.clear();
    assertNull(authenticationContext.getCurrentUser());
  }

  @Test
  void testThreadLocalIsolation_differentThreadsHaveDifferentUsers() throws InterruptedException {
    User mainThreadUser = new User();
    mainThreadUser.setId(UUID.randomUUID());
    mainThreadUser.setUsername("mainuser");

    User otherThreadUser = new User();
    otherThreadUser.setId(UUID.randomUUID());
    otherThreadUser.setUsername("otheruser");

    authenticationContext.setCurrentUser(mainThreadUser);

    CountDownLatch latch = new CountDownLatch(1);
    AtomicReference<User> otherThreadRetrievedUser = new AtomicReference<>();

    Thread otherThread = new Thread(() -> {
      authenticationContext.setCurrentUser(otherThreadUser);
      otherThreadRetrievedUser.set(authenticationContext.getCurrentUser());
      authenticationContext.clear();
      latch.countDown();
    });

    otherThread.start();
    latch.await();

    // Verify main thread still has its own user
    User mainThreadRetrievedUser = authenticationContext.getCurrentUser();
    assertNotNull(mainThreadRetrievedUser);
    assertEquals(mainThreadUser.getId(), mainThreadRetrievedUser.getId());
    assertEquals(mainThreadUser.getUsername(), mainThreadRetrievedUser.getUsername());

    // Verify other thread had its own user
    assertNotNull(otherThreadRetrievedUser.get());
    assertEquals(otherThreadUser.getId(), otherThreadRetrievedUser.get().getId());
    assertEquals(otherThreadUser.getUsername(), otherThreadRetrievedUser.get().getUsername());
  }

  @Test
  void testOverwriteCurrentUser_replacesExistingUser() {
    User firstUser = new User();
    firstUser.setId(UUID.randomUUID());
    firstUser.setUsername("firstuser");

    User secondUser = new User();
    secondUser.setId(UUID.randomUUID());
    secondUser.setUsername("seconduser");

    authenticationContext.setCurrentUser(firstUser);
    authenticationContext.setCurrentUser(secondUser);

    User retrieved = authenticationContext.getCurrentUser();
    assertNotNull(retrieved);
    assertEquals(secondUser.getId(), retrieved.getId());
    assertEquals(secondUser.getUsername(), retrieved.getUsername());
  }
}
