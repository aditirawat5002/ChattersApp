import express from 'express'
import isLogin from '../middleware/isLogin.js'
import { getCorrentChatters, getUserBySearch, getUserProfile } from '../routControlers/userhandlerControler.js'
const router = express.Router()

router.get('/profile/:id',isLogin,getUserProfile);

router.get('/search',isLogin,getUserBySearch);

router.get('/currentchatters',isLogin,getCorrentChatters)

export default router