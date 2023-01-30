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

  }
  ```

  2.4. Get user by id with his posts, profile, memberType.  
   2.5. Get users with their `userSubscribedTo`, profile.  
   2.6. Get user by id with his `subscribedToUser`, posts.  
   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).

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
