package org.furballs.rest;

import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanConstructor;
import static com.google.code.beanmatchers.BeanMatchers.hasValidGettersAndSetters;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import java.util.UUID;

class LoginResponseDtoTest {

  @Test
  public void testBean() {
    assertThat(LoginResponseDto.class, allOf(
        hasValidBeanConstructor(),
        hasValidGettersAndSetters()
    ));
  }

  @Test
  void testConstructorWithParameters() {
    String token = "fake-jwt-token-12345";
    UserDto userDto = createTestUserDto();
    
    LoginResponseDto dto = new LoginResponseDto(token, userDto);
    
    assertEquals(token, dto.getToken());
    assertEquals(userDto, dto.getUser());
  }

  @Test
  void testDefaultConstructor() {
    LoginResponseDto dto = new LoginResponseDto();
    
    assertNull(dto.getToken());
    assertNull(dto.getUser());
  }

  @Test
  void testSettersAndGetters() {
    LoginResponseDto dto = new LoginResponseDto();
    String token = "new-jwt-token";
    UserDto userDto = createTestUserDto();
    
    dto.setToken(token);
    dto.setUser(userDto);
    
    assertEquals(token, dto.getToken());
    assertEquals(userDto, dto.getUser());
  }

  @Test
  void testToString_ContainsTokenAndUser() {
    String token = "test-token";
    UserDto userDto = createTestUserDto();
    LoginResponseDto dto = new LoginResponseDto(token, userDto);
    
    String toString = dto.toString();
    
    assertNotNull(toString);
    assertTrue(toString.contains("LoginResponseDto"));
    assertTrue(toString.contains("test-token"));
  }

  @Test
  void testToString_WithNullValues() {
    LoginResponseDto dto = new LoginResponseDto();
    
    String toString = dto.toString();
    
    assertNotNull(toString);
    assertTrue(toString.contains("LoginResponseDto"));
  }

  @Test
  void testUserDtoIntegration() {
    String token = "integration-token";
    UserDto userDto = createTestUserDto();
    userDto.setUsername("integrationuser");
    userDto.setEmail("integration@test.com");
    
    LoginResponseDto dto = new LoginResponseDto(token, userDto);
    
    assertEquals("integrationuser", dto.getUser().getUsername());
    assertEquals("integration@test.com", dto.getUser().getEmail());
  }

  private UserDto createTestUserDto() {
    UserDto userDto = new UserDto();
    userDto.setId(UUID.randomUUID());
    userDto.setUsername("testuser");
    userDto.setEmail("test@example.com");
    userDto.setFirstName("Test");
    userDto.setLastName("User");
    userDto.setRole("USER");
    return userDto;
  }
}
