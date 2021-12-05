import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server';
import { USER_STATUS, ROLES } from '../constants/user.constants.js'
import Users from "../models/users.model.js";
import Enrollements from '../models/enrollments.model.js';

const allUsers = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  if(user.role !== ROLES.ADMIN) {
    throw new Error('Access denied');
  }
  return await Users.find();
};

const user = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  return user;
};

const register = async (parent, args) => {
  const user = new Users({
    ...args.input,
    status: USER_STATUS.PENDING,
    fullName: `${args.input.name} ${args.input.lastName}`,
    password: await bcrypt.hash(args.input.password, 12),
  });
  return user.save();
};

const userByEmail = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  return user;
};

const login = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  if (!user) {
    throw new Error('Usuario o contraseña incorrecta');
  }
  const isValid = await bcrypt.compare(args.password, user.password);
  if(!isValid) {
    throw new Error('Usuario o contraseña incorrecta');
  }
  const token = await jwt.sign(
    { user },
    // eslint-disable-next-line no-undef
    process.env.secretkey,
    { expiresIn: '30m' }
  );
  return token;
};

const enrollments = async (parent) => {
  const enrollments = await Enrollements.find({ user_id: parent._id });
  return enrollments;
};

const updateUser = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new AuthenticationError(errorMessage);
  }
  const updatedUser = Users.findByIdAndUpdate(user._id, { ...args.input }, { new: true });
  return updatedUser;
}

export default {
  userQueries: {
    allUsers,
    user,
    userByEmail,
  },
  userMutations: {
    register,
    login,
    updateUser,
  },
  User: {
    enrollments,
  }
}