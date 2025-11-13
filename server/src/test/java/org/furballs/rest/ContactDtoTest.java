package org.furballs.rest;

import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanConstructor;
import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanEquals;
import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanHashCode;
import static com.google.code.beanmatchers.BeanMatchers.hasValidBeanToString;
import static com.google.code.beanmatchers.BeanMatchers.hasValidGettersAndSetters;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;

import org.junit.jupiter.api.Test;

class ContactDtoTest {

  @Test
  public void testBean() {
    assertThat(ContactDto.class, allOf(
        hasValidBeanConstructor(),
        hasValidGettersAndSetters(),
        hasValidBeanHashCode(),
        hasValidBeanEquals(),
        hasValidBeanToString()
    ));
  }

}