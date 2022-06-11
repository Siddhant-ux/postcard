import express, { Router } from "express";

import { getPosts, createPost, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost } from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();
//calling middleware before getPost or create post allows us to populate our request so we can get access to it in the next controller
router.get('/', getPosts);
router.get('/search', getPostsBySearch)
router.get('/:id', getPost);

router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
//patch is used for updation, request is made to /posts/123
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost); //he/she can only like once per account
router.post('/:id/commentPost', auth, commentPost)
export default router;