import React from 'react'
import FlipMove from 'react-flip-move'
import ThreadComment from '../ThreadComment/ThreadComment'

const ThreadComments = ({comments, statusUsername, originalPostUsername}) => {
    return (
        <FlipMove>
        {
            comments.map(comment => (
                <ThreadComment key={comment.id}
                        threadCommentId = {comment.id}
                        commentAltText = {comment.commentAltText}
                        senderId = {comment.senderId}
                        username = {comment.username}
                        text = {comment.text}
                        avatar = {comment.avatar}
                        image = {comment.image}
                        timestamp = {comment.timestamp}
                        likes = {comment.likes}
                        statusUsername = {statusUsername}
                        originalPostUsername = {originalPostUsername}
            />
            ))
        }           
        </FlipMove>
    )
}

export default ThreadComments
