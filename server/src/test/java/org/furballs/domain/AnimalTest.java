package org.furballs.domain;

import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanConstructor;
import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanEquals;
import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanHashCode;
import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanToString;
import static com.google.code.beanmatchers.BeanMatchers.hasValidGettersAndSetters;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;

import com.google.code.beanmatchers.BeanMatchers;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class AnimalTest {

  @Test
  public void testBean() {
    BeanMatchers.registerValueGenerator(() -> LocalDate.of(5, 5, max(29)), LocalDate.class);
    assertThat(Animal.class, allOf(
        hasValidBeanConstructor(),
        hasValidGettersAndSetters(),
        hasValidBeanHashCode(),
        hasValidBeanEquals(),
        hasValidBeanToString()
    ));
  }

  private static int max(int limit) {
    return (int) (Math.random() * limit) + 1;
  }

}