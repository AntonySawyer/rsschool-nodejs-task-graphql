# Limit the complexity of the graphql queries

## Location in code

> Validation located in [graphql/validation/depthLimit.ts](./depthLimit.ts) and validate any `query` request. You can use any value for `DEPTH_LIMIT` variable.
> All validation rules will apply in [root graphql file](../index.ts).

## Query example for `DEPTH_LIMIT=6`

Following query will bring error with message

> _exceeds maximum operation depth of 6_

```graphql
query {
  users {
    userSubscribedTo {
      userSubscribedTo {
        userSubscribedTo {
          userSubscribedTo {
            userSubscribedTo {
              userSubscribedTo {
                id
              }
            }
          }
        }
      }
    }
  }
}
```
