// Determines whether a value is a unified AST node.
function isNode(value) {
  return typeof value === 'object' && typeof value.type === 'string'
}

// Generates a random, reasonably short string that does not occur anywhere else in the given string.
const INITIAL_LENGTH = 4
const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function buildPrefix(string) {
  let prefix = ''
  let targetLength = INITIAL_LENGTH

  while(string.indexOf(prefix) != -1) {
    while(prefix.length < targetLength) {
      prefix += VALID_CHARS.charAt(Math.random() * (VALID_CHARS.length));
    }
    targetLength = targetLength * 2 // Checking if the string contains it could take awhile, grow exponentially.
  }

  return prefix
}

export default function (options) {
  options = Object.assign({ // Defaults
    converter: undefined
  }, options)

  return function(initialStrings, ...initialValues) {
    // First pass, insert non-node values into strings
    const strings = [initialStrings[0]] // Always non-empty array (might only have '')
    const nodes = []
    for(let i = 1; i < initialStrings.length; i++) {
      let value = initialValues[i - 1];
      if(options.converter) {
        value = options.converter(value)
      }
      if(isNode(value)) {
        strings.push(initialStrings[i]);
        nodes.push(value);
      }else {
        strings.push(strings.pop() + String(value) + initialStrings[i])
      }
    }

    // Insert node markers
    const prefix = buildPrefix(strings.join('')) // Build prefix, ensuring that the complete string does not contain it.
    let string = strings[0]
    for(let i = 1; i < strings.length; i++) {
      string += `<${prefix}:${i - 1}>${strings[i]}`
    }

    function astInserter() {
      const parser = this.Parser
      function tokenizer(eat, value, silent) {
        let match = new RegExp(`^<${prefix}:([0-9])+>`).exec(value)
        if (match) {
          if (silent) {
            return true
          }

          return eat(match[0])(nodes[Number(match[1])])
        }
      }

      tokenizer.locator = function(value, fromIndex) {
        return value.indexOf(`<${prefix}`, fromIndex)
      }

      this.Parser.prototype.inlineTokenizers.templateStringNode = tokenizer
      this.Parser.prototype.inlineMethods.splice(0, 0, 'templateStringNode')
    }

    return {string, astInserter, prefix, nodes}
  }
}