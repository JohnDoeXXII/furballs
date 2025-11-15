package org.furballs.domain.animal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AnimalEndpointTest {

  @Mock
  private AnimalRepository repository;

  @InjectMocks
  private AnimalEndpoint endpoint;

  @BeforeEach
  void setUp() {
    // Setup common test data if needed
  }

  @Test
  void getAnimalCountByType_shouldReturnCountForCat() {
    // Arrange
    String type = "Cat";
    long expectedCount = 5L;
    when(repository.countByType(type)).thenReturn(expectedCount);

    // Act
    long actualCount = endpoint.getAnimalCountByType(type);

    // Assert
    assertEquals(expectedCount, actualCount);
    verify(repository).countByType(type);
  }

  @Test
  void getAnimalCountByType_shouldReturnCountForDog() {
    // Arrange
    String type = "Dog";
    long expectedCount = 3L;
    when(repository.countByType(type)).thenReturn(expectedCount);

    // Act
    long actualCount = endpoint.getAnimalCountByType(type);

    // Assert
    assertEquals(expectedCount, actualCount);
    verify(repository).countByType(type);
  }

  @Test
  void getAnimalCountByType_shouldReturnZeroWhenNoAnimalsOfType() {
    // Arrange
    String type = "Bird";
    long expectedCount = 0L;
    when(repository.countByType(type)).thenReturn(expectedCount);

    // Act
    long actualCount = endpoint.getAnimalCountByType(type);

    // Assert
    assertEquals(expectedCount, actualCount);
    verify(repository).countByType(type);
  }
}
