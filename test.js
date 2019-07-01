import rai from './index.js'
import remark from 'remark'

function converter(value) {
  return { type: 'value', value: value }
}

let { string, astInserter } = rai({converter})`\
# This is some markdown...
I'm going to insert a value into the AST riiight ${"foobar"}here.

${{
  type: 'strong',
  children: [{type: 'text', value: 'not here'}]
}}
`

console.log(JSON.stringify(
  remark()
    .use(astInserter) // The plugin returned above should be last
    .parse(string), // The exact(!) string returned above)
  null, '  '))