import React from 'react'
import { Header, Form, Dimmer, Divider } from 'semantic-ui-react'

function BistCommentForm({ authenticated, commentText, handleAddComment, handleChange }) {
  return (
    <div style={
        {
            width: 700,
            height: 150,
            marginTop: 15,
            marginLeft: 230,
            backgroundColor: "#f5f5f5",
            borderRadius: 10,
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e5e5",
            padding: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

        }
    }>
      <Header textAlign={"center"}>Add a comment</Header>
      <Divider />
      <Dimmer.Dimmable dimmed={!authenticated}>
        <Form onSubmit={handleAddComment}>
          <Form.Group inline>
            <Form.Input
              id='commentText'
              value={commentText}
              placeholder='Tell us more about ...'
              style={{ resize: 'none' }}
              onChange={handleChange}
              fluid
              width={13}
            />
            <Form.Button
              content='Submit'
              disabled={commentText.trim() === ''}
              color='blue'
              fluid
              width={3}
            />
          </Form.Group>
        </Form>

        <Dimmer active={!authenticated}>
          <Header inverted>To add a comment you must be logged in</Header>
        </Dimmer>
      </Dimmer.Dimmable>
    </div>
  )
}

export default BistCommentForm