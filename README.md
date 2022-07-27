# Paradar
<div align="center">
  <img src="https://osoc.be/editions/2022/projects/paradar.svg" width="250px" />
</div>
Paradar is a Proof-of-Concept tracking app that allows NCCN to track useful resources (VIP, assets, ...) in their internal tools (crisis management, emergency planning, ...) by using physical IoT Trackers and smartphones.

## Get Started & Live
In order to get started with Paradar, you'll need 2 dependencies:
- [Node 16.16.0 or higher](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

After having the 2 depdencies installed, clone the project to your working machine...
```bash
$ git clone git@github.com:osoc22/project-track-trace.git
```
... install the dependencies...
```bash
$ yarn install
```
... enter the correct `env` variables...
```bash
$ touch .env
$ FLESPI_KEY=XXXX > .env
```
... and run the project to start contributing!
```bash
$ yarn dev
```
## Available commands
|Command|Usage|
|---|---|
|`yarn install`|Installs the dependencies as listed in `package.json` and matches the versions to the `yarn.lock`|
|`yarn dev`|Starts a hot-reloading development server on [`localhost:3000`](http://localhost:3000) *(Or another random port if 3000 is not available)*|
|`yarn generate`|Generates a production-ready static version of the app for static deployment|
|`yarn start`|Runs the production-version locally (:exclamation: Requires you to run `yarn generate` beforehand)|

## `.env`
| Key              | Explanation                                                         | Example         |
|------------------|---------------------------------------------------------------------|-----------------|
| FLESPI_KEY       | The API key needed to contact the Flespi server                     | AHVSIB27836     |

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## TypeScript
This project uses the Nuxt TypeScript for TypeScript Support. More info can be found [here](https://typescript.nuxtjs.org/)

## Progressive Web App
This web app is packaged as a Progressive Web App, giving it some additional optimization & configuration. More info can be found [here](https://pwa.nuxtjs.org/) 

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
