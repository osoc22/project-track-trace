# Components
## General
This directory contains all **Vue** components. While you're working, make sure to keep the following things in mind:
- While working, keep the [Vue Documentation](https://vuejs.org/guide/introduction.html) near you. A lot that you're using *(If/else, Loops, conditional rendering, etc...)* can be handled by Vue itself.
- Make your components as atomic as possible. A button is a component, so is the base of a menu. This will allow you to reuse you're components.

## TypeScript
In addition to Vue, you are using Typescript in your Vue files. While TypeScript is *technically* JavaScript, you should keep the following things in mind:

> 💡 All this information can be found [here](https://vuejs.org/guide/typescript/overview.html#general-usage-notes)

- Add `lang="ts"` to the `<script>` tag
- Make sure to wrap the object in `export default` with `defineComponent()`. This will let TypeScript infer types inside the component.
  ```js
  export default defineComponent({})
  ```
- To use more complex types, you might need to first create an interface for your type and wrap it within a `PropType<>`, as explained [here](https://vuejs.org/guide/typescript/options-api.html#typing-component-props). *❗ There are some [caveats](https://vuejs.org/guide/typescript/options-api.html#caveats) when it comes to default and validator typing, so keep this in mind ❗*
- You can also type other parts of the components options and for more information, look [here](https://vuejs.org/guide/typescript/options-api.html#typing-event-handlers)
