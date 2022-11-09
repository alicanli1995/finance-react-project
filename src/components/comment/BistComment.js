import React, {useEffect, useState} from 'react'
import {Header, Comment, Divider, Grid} from 'semantic-ui-react'
import { getAvatarUrl } from '../misc/Helpers'
import {useKeycloak} from "@react-keycloak/web";
import {bistApi} from "../misc/BistApi";
import {Button} from "@material-ui/core";
import {toast} from "react-toastify";

function BistComment({ comments,bistName }) {
    const { keycloak } = useKeycloak();
    let [commentList, setCommentList] = useState('');
    const height = window.innerHeight - 400

    const getNotification = (message) => {
        return (
            toast.success(`${message} 💯🏆🙌`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        );
    }

    async function deleteComment(commentText) {
        await bistApi.deleteComment(bistName, keycloak.token, commentText).then(() => {
            getNotification("Comment deleted")
            comments = comments.filter((comment) => comment.text !== commentText)
            setCommentList( comments.map((comment, i) => {
                return (
                    <Comment key={comment.username + i}>
                        <Comment.Avatar src={getAvatarUrl(comment.avatar)} />
                        <Comment.Content>
                            <Comment.Author as='a'>{comment.username}</Comment.Author>
                            <Comment.Metadata>
                                <div>{new Date(comment.timestamp).toDateString()}</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                <Grid>
                                    <Grid.Column width={14}>
                                        {comment.text}
                                    </Grid.Column>
                                    {comment.username === getUsername() &&
                                        <Button variant="outlined" color="secondary" onClick={() => deleteComment(comment.text)} style={
                                            {float: "inline-end" , width: 100, height: 30, fontSize: 10, marginBottom: 30}}>❌</Button>}
                                </Grid>
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                )
            })  )
        }).catch((error) => {
            getNotification("Comment delete failed !")
        })
    }

    const getUsername = () => {
      return keycloak.authenticated && keycloak.tokenParsed && keycloak.tokenParsed.preferred_username
    }

    useEffect(() => {
        setCommentList( comments.map((comment, i) => {
        return (
          <Comment key={comment.username + i}>
            <Comment.Avatar src={getAvatarUrl(comment.avatar)} />
            <Comment.Content>
              <Comment.Author as='a'>{comment.username}</Comment.Author>
              <Comment.Metadata>
                <div>{new Date(comment.timestamp).toDateString()}</div>
              </Comment.Metadata>
              <Comment.Text>
                  <Grid>
                      <Grid.Column width={14}>
                  {comment.text}
                        </Grid.Column>
                  {comment.username === getUsername() &&
                  <Button variant="outlined" color="secondary" onClick={() => deleteComment(comment.text)}
                          style={
                    { width: 60, height: 30, fontSize: 10  }
                  }>❌</Button>}
                  </Grid>
              </Comment.Text>
            </Comment.Content>
          </Comment>
        )
      }))
    }, [comments])

  return (
      <>
        <div style={
            {
                width: 700,
                marginTop: 15,
                marginLeft: 180,
                borderRadius: 10,
            }}>
            <Header textAlign={"center"}>Comments</Header>
            <Divider />
        </div>
      <Comment.Group style={
        {
            height: height,
            marginTop: 15,
            marginLeft: 180,
            overflowY: "scroll",
            overflowX: "hidden",
            maxWidth: 700,
            maxHeight: height - 250,

        }
      }>

        {commentList}
      </Comment.Group>
      </>
  )
}

export default BistComment