package org.furballs.rest;

import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanConstructor;
import static com.google.code.beanmatchers.BeanMatchers.hasValidGettersAndSetters;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class LoginRequestDtoTest {

  @Test
  public void testBean() {
    assertThat(LoginRequestDto.class, allOf(
        hasValidBeanConstructor(),
        hasValidGettersAndSetters()
    ));
  }

  @Test
  void testConstructorWithParameters() {
    String username = "testuser";
    String password = "password123";
    
    LoginRequestDto dto = new LoginRequestDto(username, password);
    
    assertEquals(username, dto.getUsername());
    assertEquals(password, dto.getPassword());
  }

  @Test
  void testDefaultConstructor() {
    LoginRequestDto dto = new LoginRequestDto();
    
    assertNull(dto.getUsername());
    assertNull(dto.getPassword());
  }

  @Test
  void testSettersAndGetters() {
    LoginRequestDto dto = new LoginRequestDto();
    
    dto.setUsername("newuser");
    dto.setPassword("newpass");
    
    assertEquals("newuser", dto.getUsername());
    assertEquals("newpass", dto.getPassword());
  }

  @Test
  void testToString_RedactsPassword() {
    LoginRequestDto dto = new LoginRequestDto("testuser", "secretpassword");
    
    String toString = dto.toString();
    
    assertTrue(toString.contains("testuser"));
    assertTrue(toString.contains("[REDACTED]"));
    assertFalse(toString.contains("secretpassword"));
  }

  @Test
  void testToString_WithNullValues() {
    LoginRequestDto dto = new LoginRequestDto();
    
    String toString = dto.toString();
    
    assertNotNull(toString);
    assertTrue(toString.contains("LoginRequestDto"));
  }
}
