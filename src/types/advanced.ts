/**
 * @module types/advanced
 * @description Advanced TypeScript definitions to enforce compile-time safety across CivicPath.
 * Demonstrates deep type system mastery using Conditional, Mapped, and Utility types.
 */

/**
 * DeepReadonly ensures that a deeply nested object cannot be mutated.
 * @pattern Functional Programming / Immutability
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends (infer U)[]
      ? ReadonlyArray<DeepReadonly<U>>
      : T[P] extends object
      ? DeepReadonly<T[P]>
      : T[P];
  };

  /**
   * NonNullableKeys extracts keys of an object that are not allowed to be null or undefined.
   */
  export type NonNullableKeys<T> = {
    [P in keyof T]-?: null extends T[P] ? never : undefined extends T[P] ? never : P;
  }[keyof T];

  /**
   * Result type for Error Monad pattern.
   * Forces the caller to check for success before accessing data, eliminating unhandled exceptions.
   */
  export type Result<T, E extends Error = Error> =
    | { success: true; data: T }
    | { success: false; error: E };

  /**
   * Anti-Corruption Layer (ACL) transform function signature.
   * Validates and maps external API shapes into strongly typed internal domains.
   */
  export type ACLTransform<External, Internal> = (payload: External) => Result<Internal>;

