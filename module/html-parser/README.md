HTML Parser

```js
const testHTML = `
  <div class="hello" id="world">
    <input class="input 1" />
    plain text < plain > text
    <input class="input 2" />
    <table>
      <thead>Hello</thead>
      <tbody>
        <tr>
          <td>Hello</td>
        </tr>
      </tbody>
    </table>
  </div>
  <input class="input 3" />
  <style>
    .css { css: 'css' }
  </style>
  <div test="test"></div>
`

const root = parseHTML(testHTML).root
const wash = node => node instanceof Array
  ? node.map(wash)
  : node 
  ? (node.next || []).map(wash).length
    ? ({ data: node.data, next: (node.next || []).map(wash) })
    : ({ data: node.data })
  : null
const res = wash(root)
console.log(res)
```

``` json
[
  {
    "data": {
      "tagName": "div",
      "attrs": {
        "class": "hello",
        "id": "world"
      }
    },
    "next": [
      {
        "data": {
          "tagName": "input",
          "attrs": {
            "class": "input 1"
          },
          "isUnary": true
        }
      },
      {
        "data": {
          "tagName": "text",
          "text": "plain text < plain > text"
        }
      },
      {
        "data": {
          "tagName": "input",
          "attrs": {
            "class": "input 2"
          },
          "isUnary": true
        }
      },
      {
        "data": {
          "tagName": "table"
        },
        "next": [
          {
            "data": {
              "tagName": "thead"
            },
            "next": [
              {
                "data": {
                  "tagName": "text",
                  "text": "Hello"
                }
              }
            ]
          },
          {
            "data": {
              "tagName": "tbody"
            },
            "next": [
              {
                "data": {
                  "tagName": "tr"
                },
                "next": [
                  {
                    "data": {
                      "tagName": "td"
                    },
                    "next": [
                      {
                        "data": {
                          "tagName": "text",
                          "text": "Hello"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "data": {
      "tagName": "input",
      "attrs": {
        "class": "input 3"
      },
      "isUnary": true
    }
  },
  {
    "data": {
      "tagName": "style"
    },
    "next": [
      {
        "data": {
          "tagName": "text",
          "text": ".css { css: 'css' }"
        }
      }
    ]
  },
  {
    "data": {
      "tagName": "div",
      "attrs": {
        "test": "test"
      }
    }
  }
]
```