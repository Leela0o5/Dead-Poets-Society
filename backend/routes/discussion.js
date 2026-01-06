import { Router } from 'express';
const router = Router();

import { addDiscussion, getDiscussions, deleteDiscussion } from '../controllers/discussionController';

import verifyToken from '../middleware/authMiddleware';

// Add a comment/discussion
router.post('/:poemId', verifyToken, addDiscussion);

// Get all discussions for a poem
router.get('/:poemId', getDiscussions);

// Delete a specific discussion
router.delete('/:discussionId', verifyToken, deleteDiscussion);

export default router;