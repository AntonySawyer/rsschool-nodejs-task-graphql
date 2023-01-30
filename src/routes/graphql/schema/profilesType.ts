import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } from "graphql";

import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { GraphQlContext } from "../context";

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
