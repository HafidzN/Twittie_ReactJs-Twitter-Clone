import React  from 'react'
import FlipMove from 'react-flip-move'
import Post from '../Post/Post'

const Posts = ({posts}) => {

    return (
        <>
        <FlipMove>
        {
            posts.map(post => (
                <Post key={post.id}
                        postId = {post.id}
                        altText = {post.altText}
                        senderId = {post.senderId}
                        username = {post.username}
                        text = {post.text}
                        avatar = {post.avatar}
                        image = {post.image}
                        timestamp = {post.timestamp}
                        likes = {post.likes}
            />
            ))
        }           
        </FlipMove>
        </>
    )
}

export default Posts
