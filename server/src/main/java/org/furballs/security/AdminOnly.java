package org.furballs.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark controller methods that require admin role.
 * Use this annotation alongside Spring's @RequestMapping annotations
 * (@GetMapping, @PostMapping, etc.) to restrict access to admin users only.
 * 
 * Example usage:
 * <pre>
 * &#64;GetMapping("/admin/users")
 * &#64;AdminOnly
 * public List&lt;User&gt; getAllUsers() {
 *   // Only accessible to admin users
 * }
 * </pre>
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AdminOnly {
}
