<br><br>

<h3 align="center">v-suggest</h3>

<br>

<p align="center"><img src="https://terryz.github.io/image/v-suggest/v-suggest.png" alt="v-suggest" ></p>

<p align="center">
  A <strong>Vue2</strong> plugin for input content suggestions, support using keyboard to navigate and quick pick, <br>it make use experience like search engine input element
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/v-suggest"><img src="https://img.shields.io/npm/v/v-suggest.svg"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"></a>
  <a href="https://www.npmjs.com/package/v-suggest"><img src="https://img.shields.io/npm/dy/v-suggest.svg"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"></a>
</p>

<br><br><br><br><br>

## Examples and Documentation

Live example on [CodePen](https://codepen.io/terry05/pen/KKPQwxP), more examples and documentation please visit below sites

- [English site](https://terryz.github.io/vue/#/suggest)
- [国内站点](https://terryz.gitee.io/vue/#/suggest)

## Installation

<a href="https://nodei.co/npm/v-suggest/"><img src="https://nodei.co/npm/v-suggest.png"></a>

```
npm i v-suggest -S
```

Include and install plugin in your `main.js` file

```js
// Globally install plugin
import Vue from 'vue'
import Suggest from 'v-suggest'
Vue.use(Suggest)

// Import Suggest as a local component
import { Suggest } from 'v-suggest'
export default {
  components: {
    'v-suggest': Suggest
  }
}
```

## Usage

```vue
<template>
  <v-suggest
    :data="example"
    show-field="name"
    v-model="myValue"
  ></v-suggest>
</template>

<script>
export default {
  data () {
    return {
      myValue: '',
      example: [
        { id: 1, name: 'Chicago Bulls', desc: '芝加哥公牛' },
        { id: 2, name: 'Cleveland Cavaliers', desc: '克里夫兰骑士' },
        { ... }
      ]
    }
  }
}
</script>
```
