import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js'


export const getPost = async (req, res) => {
    const {id} = req.params;
    try{
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    }catch(err){
        console.log(err);
    }
}


export const getPosts = async (req, res) => {
    const {page} = req.query;  //query string in an object form
    try{
        const LIMIT = 8;
        const startIndex = (Number(page) - 1)*LIMIT;
        const total = await PostMessage.countDocuments({});
        
        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});
    }catch(error){
        res.status(404).json({message: error.message});
    }
};

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;
    try{
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [{title}, {tags: {$in: tags.split(',') }}]});
        res.json({data: posts});
    }catch(err){
        console.log(err);
        res.status(404).json({message: error.message});
    }
}


export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});
    try{
        await newPost.save();
        res.status(201).json(newPost);  // 201 stands for created successfully
    }catch(error){
        res.status(409).json({message: error.message});  //conflict
    }
    res.send('Post Creating');
};


export const updatePost = async (req, res) => {
    const {id: _id} = req.params; //renamed id as _id
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id))return res.status(404).send('No post with that id');
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true}); //The default is to return the original, unaltered document. If you want the new, updated document to be returned you have to pass an additional argument: an object with the new property set to true.

    res.json(updatedPost);//so we get the updated post as return value
}

export const deletePost = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))return res.status(404).send('No post with that id');
    await PostMessage.findByIdAndRemove(id);
    res.json({message: 'Post Deleted'});
}

export const likePost = async (req, res) => {
    const {id} = req.params;

    if(!req.userId)return res.json({message: "Unauthenticated"});
    
    if(!mongoose.Types.ObjectId.isValid(id))return res.status(404).send('No post with that id');
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1){
        //like the post
        post.likes.push(req.userId);
    }else{
        //dislike the post
        post.likes = post.likes.filter(id => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const {id} = req.params;
    const {value} = req.body;
    const post = await PostMessage.findById(id);
    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});
    res.json(updatedPost);
}