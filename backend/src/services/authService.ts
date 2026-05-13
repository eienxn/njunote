import Database from 'better-sqlite3';
import { UserCreateInput, AuthResponse, UserPublic } from '../types';
import * as userDAO from '../dao/userDAO';
import { generateToken } from '../utils/jwt';

function toPublicUser(user: any): UserPublic {
  const { password, ...publicUser } = user;
  return publicUser;
}

export function register(db: Database.Database, input: UserCreateInput): AuthResponse {
  const existing = userDAO.findByEmail(db, input.email);
  if (existing) throw new Error('Email already exists');

  const user = userDAO.create(db, input);
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: toPublicUser(user), token };
}

export function login(db: Database.Database, email: string, password: string): AuthResponse {
  const user = userDAO.findByEmail(db, email);
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ userId: user.id, email: user.email });
  return { user: toPublicUser(user), token };
}
