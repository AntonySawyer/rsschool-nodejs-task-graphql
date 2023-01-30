import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputObjectType } from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { GraphQlContext } from "../../context";

export const ProfileType = new GraphQLObjectType<ProfileEntity, GraphQlContext>({
  name: 'profile',
  fields: {
    id: {
      type: GraphQLID, // TODO: format: uuid
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLInt,
    },
    country: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberTypeId: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLString, // TODO: format: uuid
    }, 
  }
});

export const ProfileInputType = new GraphQLInputObjectType({
  name: 'ProfileInput',
  fields: {
    avatar: {
      type: new GraphQLNonNull(GraphQLString),
    },
    sex: {
      type: new GraphQLNonNull(GraphQLString),
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
    },
    street: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
    }, 
  }
});
