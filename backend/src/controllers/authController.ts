import { Request, Response } from 'express';
import db from '../config/database';
import * as authService from '../services/authService';
import { UserCreateInput } from '../types';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const input: UserCreateInput = req.body;
    const result = authService.register(db, input);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = authService.login(db, email, password);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    // For now, just return user info from token
    res.status(200).json({ success: true, data: req.user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
