# remark-ast-inline
An experimental package for adding nodes and values to a abstract syntax tree from template expressions, via a [unified](https://github.com/unifiedjs/unified) parser of the [kind exposed by remark](https://github.com/remarkjs/remark/tree/master/packages/remark-parse#extending-the-parser).

# Usage
## Import
```javascript
import rai from 'remark-ast-express'
```

## Configure
```javascript
const md = rai({
  converter // Optional
})

function converter(value) {
  return { type: 'value', value: val }
}
```

The converter function is called (if present) with all the expressions that would be inserted into your template string. It can return either an [unist](https://github.com/syntax-tree/unist) node (an object with a `type` field containing a string) to later be inserted into the AST or a value to be inserted into the string. For example, to make this package completely useless:

```javascript
function converter(value) {
  return String(value) // Can't just be `return value` or nodes would still be inserted.
)
```

## Process Text
```javascript
let { string, inserter } = md`\
# This is some markdown...
I'm going to insert a value into the AST riiight ${"foobar"}here.

${{
  type: 'strong',
  children: [{type: 'text', value: 'not here'}]
}}
`

import remark from 'remark'
 
let tree = remark()
  .use(...others...)
  .use(plugin) // The plugin returned above should be last
  .parse(string) // The exact(!) string returned above
```
TODO

# WTF? Why?
Well, this gives you a nice(ish) syntax in vanilla Javascript for programmatically inserting nodes into the AST inline; which might be useful...? I'm planning to use it to implement a React/JS+Markdown website templating framework; it was the least awkward (maybe relatively OK?) way to hack something together that I liked more than the alternatives (e.g. [MDX](https://mdxjs.com/)).
