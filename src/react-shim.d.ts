declare module 'react' {
  export type ReactNode = any;
  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode };
  export type Dispatch<T> = (value: T) => void;
  export type SetStateAction<T> = T | ((previous: T) => T);
  export const StrictMode: any;
  export class Component<P = unknown, S = unknown> {
    constructor(props: P);
    props: P;
    state: S;
    setState(value: Partial<S> | ((previous: S) => Partial<S>)): void;
    render(): ReactNode;
  }
  export function useState<T>(initial: T): [T, (value: SetStateAction<T>) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps?: unknown[]): T;
  const React: { StrictMode: any; Component: typeof Component };
  export default React;
}

declare module 'react-dom/client' {
  export function createRoot(element: Element): { render(node: any): void };
}

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
