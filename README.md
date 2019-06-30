# remark-ast-express
An experimental package for adding nodes and values to a abstract syntax tree from template expressions, via a unified parser of the kind exposed by remark.

# Usage
## Import
```javascript
import rae, { OPERATIONS } from 'remark-ast-express'
```
## Configure
```javascript
const md = rae({
  converter // Optional
})

function converter(value) {
  return { type: 'value', value: val }
}
```

The converter function is called with all the expressions that would be inserted into your template string (the default is above). They can return either an [unist](https://github.com/syntax-tree/unist) node (an object with a `type` field containing a string), non-undefined value to be inserted into the string as normal, or undefined to do nothing. For example, to make this package completely useless:

```javascript
function converter(value) {
  // Note: This could also be done with `return String(value)`, just trying to emphasize the whole undefined thing...
  if(value !== undefined) {
    return value
  }else {
    return "undefined"
  }
)
```
