
import { Response } from 'express';
import { FollowService } from '../services/followService';
import { UserService } from '../services/userService';
import { CustomRequest } from '../middleware/authenticate';

export class FollowController {
    private followService: FollowService;
    private userService: UserService;

    constructor() {
        this.followService = new FollowService();
        this.userService = new UserService();
    }

    followUser = async (req: CustomRequest, res: Response) => {
        try {
            const followerId = req.user?.id;
            if (!followerId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const followingId = parseInt(req.params.id, 10);

            if (followerId === followingId) {
                return res.status(400).json({ message: 'You cannot follow yourself' });
            }

            const userToFollow = await this.userService.getUserById(followingId);
            if (!userToFollow) {
                return res.status(404).json({ message: 'User to follow not found' });
            }

            await this.followService.followUser(followerId, followingId);
            res.status(201).json({ message: 'User followed successfully' });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Already following') {
                    return res.status(409).json({ message: 'User already followed' });
                }
            }
            res.status(500).json({ message: 'Error following user', error });
        }
    };

    unfollowUser = async (req: CustomRequest, res: Response) => {
        try {
            const followerId = req.user?.id;
            if (!followerId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const followingId = parseInt(req.params.id, 10);

            await this.followService.unfollowUser(followerId, followingId);
            res.status(200).json({ message: 'User unfollowed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error unfollowing user', error });
        }
    };

    getFollowers = async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const followers = await this.followService.getFollowers(userId);
            const followerIds = followers.map(f => f.followerId);
            res.status(200).json(followerIds);
        } catch (error) {
            res.status(500).json({ message: 'Error getting followers', error });
        }
    };

    getFollowing = async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const following = await this.followService.getFollowing(userId);
            const followingIds = following.map(f => f.followingId);
            res.status(200).json(followingIds);
        } catch (error) {
            res.status(500).json({ message: 'Error getting following', error });
        }
    };
}
