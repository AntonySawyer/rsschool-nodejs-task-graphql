# GraphQL Request examples

## Get gql requests:

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

## Create gql requests (using `InputObjectType`):

2.8. Create user.

```graphql
mutation {
  createUser(
    data: { firstName: "First", lastName: "Last", email: "mail@example.com" }
  ) {
    id
  }
}
```

2.9. Create profile.

> **!** Replace `$ID` with real user `id`

```graphql
mutation {
  createProfile(
    data: {
      avatar: "avatar"
      sex: "sex"
      birthday: 1
      country: "country"
      street: "street"
      city: "city"
      memberTypeId: "business"
      userId: "ID"
    }
  ) {
    id
  }
}
```

2.10. Create post.

> **!** Replace `$ID` with real user `id`

```graphql
mutation {
  createPost(data: { title: "title", content: "content", userId: "id" }) {
    id
  }
}
```

## Update gql requests (usind `InputObjectType`):

2.12. Update user.

> **!** Replace `$ID` with real user `id`. Fell free to add other `user` fields for update.

```graphql
mutation {
  updateUser(
    data: { id: "$ID", firstName: "First", email: "mail@example.com" }
  ) {
    id
  }
}
```

2.13. Update profile.

> **!** Replace `$ID` with real profile `id`. Fell free to add other `profile` fields for update.

```graphql
mutation {
  updateProfile(data: { id: "$ID", country: "country1" }) {
    id
  }
}
```

2.14. Update post.

> **!** Replace `$ID` with real post `id`. Fell free to add other `post` fields for update.

```graphql
mutation {
  updatePost(data: { id: "$ID", title: "New Title" }) {
    id
  }
}
```

2.15. Update memberType.

```graphql
mutation {
  updateMemberType(data: { id: "business", discount: 20 }) {
    id
  }
}
```

2.16. Subscribe to; unsubscribe from.

- Subscribe:
  > **!** Replace `$ID1` and `$ID2` with real users `id`.

```graphql
mutation {
  subscribeUser(data: { whoSubscribeId: "$ID1", subscribeToId: "$ID2" }) {
    id
  }
}
```

- Unsubscribe:
  > **!** Replace `$ID1` and `$ID2` with real users `id`.

```graphql
mutation {
  subscribeUser(data: { whoUnsubscribeId: "$ID1", unsubscribeFromId: "$ID2" }) {
    id
  }
}
```
