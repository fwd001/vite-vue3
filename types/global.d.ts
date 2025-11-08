import type {
  ComponentRenderProxy,
  VNode,
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType,
} from 'vue';

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };
  declare interface Window {
    // Global vue app instance
    __bizConfig__: {
      title: string;
      VITE_GLOB_IS_XXX: boolean;
      VITE_GLOB_XXX: number[];
      VITE_GLOB_DICTIONARY_URL: string;
      /** 版本检测轮询间隔（毫秒），默认 10 秒 */
      VITE_UPDATE_INTERVAL: number;
    };
    /**
     * 版本更新提示的触发函数（由 `UpdatePopup/Popup.vue` 运行时挂载）
     */
    __showUpdatePrompt?: (cb: () => void) => void;
    __app_version?: string;
  }

  /**
   * 也允许以全局变量的形式直接调用（与 Window 字段保持一致）
   */
  let __showUpdatePrompt: (cb: () => void) => void;

  // fix FullScreen type error
  interface Document {
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }

  // vue
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = VNodeChild | JSX.Element;

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = T | null;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type Indexable<T = any> = {
    [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  const BM: any;
  const bmgl: any;

  declare interface ViteEnv {
    VITE_USE_MOCK: boolean;
    VITE_PUBLIC_PATH: string;
    VITE_GLOB_APP_TITLE: string;
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
  }

  declare function parseInt(s: string | number, radix?: number): number;

  declare function parseFloat(string: string | number): number;

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}
