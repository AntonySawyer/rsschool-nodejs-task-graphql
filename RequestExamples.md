# GraphQL Request examples

- Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.

  ```graphql
  query {
    posts {
      id
    }
    memberTypes {
      id
    }
    profiles {
      id
    }
    users {
      id
    }
  }
  ```

  2.2. Get user, profile, post, memberType by id - 4 operations in one query.

  > **!** Replace `$ID` with real `id` of related entities

  ```graphql
  query {
    post(id: "$ID") {
      id
    }
    memberType(id: "business") {
      id
    }
    profile(id: "$ID") {
      id
    }
    user(id: "$ID") {
      id
    }
  }
  ```

  2.3. Get users with their posts, profiles, memberTypes.

  ```graphql
  query {
    users {
      id
      posts {
        id
      }
      profile {
        id
      }
      memberTypes {
        id
      }
    }
  }
  ```

  2.4. Get user by id with his posts, profile, memberType.

  > **!** Replace `$ID` with real user `id`

  ```graphql
  query {
    user(id: $ID) {
      id
      posts {
        id
      }
      profile {
        id
      }
      memberTypes {
        id
      }
    }
  }
  ```

  2.5. Get users with their `userSubscribedTo`, profile.

  ```graphql
  query {
    users {
      id
      userSubscribedTo {
        id
        profile {
          id
        }
      }
    }
  }
  ```

  2.6. Get user by id with his `subscribedToUser`, posts.

  > **!** Replace `$ID` with real user `id`

  ```graphql
  query {
    user(id: $ID) {
      id
      userSubscribedTo {
        id
        posts {
          id
        }
      }
    }
  }
  ```

  2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).

  ```graphql
  query {
    users {
      userSubscribedTo {
        id
        userSubscribedTo {
          id
        }
        subscribedToUser {
          id
        }
      }
      subscribedToUser {
        id
        userSubscribedTo {
          id
        }
        subscribedToUser {
          id
        }
      }
    }
  }
  ```

  - Create gql requests:  
    2.8. Create user.  
    2.9. Create profile.  
    2.10. Create post.  
    2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.
  - Update gql requests:  
    2.12. Update user.  
    2.13. Update profile.  
    2.14. Update post.  
    2.15. Update memberType.  
    2.16. Subscribe to; unsubscribe from.  
    2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.
