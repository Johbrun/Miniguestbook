// node-serialize@0.0.3 ships no type definitions.
declare module 'node-serialize' {
  export function serialize(obj: unknown): string;
  export function unserialize(str: string): any;
}
