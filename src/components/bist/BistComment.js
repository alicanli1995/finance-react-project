import React from 'react'
import { Header, Comment, Divider } from 'semantic-ui-react'
import { getAvatarUrl } from '../misc/Helpers'

function BistComment({ comments }) {
  const height = window.innerHeight - 400
  const style = {
    height: height,
    maxHeight: height - 250,
    overflowY: 'auto',
    overflowX: 'hidden',
    maxWidth: 'none'
  }

  const commentList = comments.map((comment, i) => {
    return (
      <Comment key={comment.username + i}>
        <Comment.Avatar src={getAvatarUrl(comment.avatar)} />
        <Comment.Content>
          <Comment.Author as='a'>{comment.username}</Comment.Author>
          <Comment.Metadata>
            <div>{new Date(comment.timestamp).toDateString()}</div>
          </Comment.Metadata>
          <Comment.Text>{comment.text}</Comment.Text>
        </Comment.Content>
      </Comment>
    )
  })

  return (
    <>
      <Header>Comments</Header>
      <Divider />
      <Comment.Group style={style}>
        {commentList}
      </Comment.Group>
    </>
  )
}

export default BistComment