# Plugins
## General
[Plugins](https://nuxtjs.org/docs/directory-structure/plugins) allow you to extract TypeScript logic to a separate file that can be inject in all of your `.vue` files.

You'll use it for 3 things:
- Use Vue Plugins in the Nuxt App
- Use external packages/modules/... in the Nuxt App
- Make functions & values available for the client or server

The last one is the one you'll probably use it for the most. More information about how to set it up can be found here:

- [Setting up Vue Plugins](https://nuxtjs.org/docs/directory-structure/plugins#vue-plugins)
- [Setting up external packages](https://nuxtjs.org/docs/directory-structure/plugins#external-packages)
- [Making self-made functions & values available to the root & context](https://nuxtjs.org/docs/directory-structure/plugins#inject-in-root--context)

## TypeScript
All your files are also written in TypeScript! So that means, you'll need to do some additional things to make sure you have proper typing support.

You'll need to add your function to the already existing `Cue` type, `Context` type or combine it.

I suggest using the `combined` method, as you make you function then globally available and typed.

> You can always find more info [here](https://typescript.nuxtjs.org/cookbook/plugins/).

```ts
/*
 * $myInjectionFunction is the name you pass along with the `inject` function, 
 * all the way at the bottom of the file.
 */
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $myInjectedFunction(message: string): void
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $myInjectedFunction(message: string): void
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $myInjectedFunction(message: string): void
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $myInjectedFunction(message: string): void
  }
}

const myPlugin: Plugin = (context, inject) => {
  inject('myInjectedFunction', (message: string) => console.log(message))
}

export default myPlugin
```
