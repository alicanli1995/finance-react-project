import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Grid } from 'semantic-ui-react'
import { handleLogError } from '../misc/Helpers'
import { bistApi } from '../misc/BistApi'
import BistCommentForm from './BistCommentForm'
import { withKeycloak } from '@react-keycloak/web'
import BistComment from "./BistComment";

class BistComments extends Component {
    state = {
        authenticated: true,
        bist: null,
        commentText: '',
        comments: []
    }

    async componentDidMount() {
        const name = this.props.match.params.id
        const { authenticated } = this.props.keycloak
        this.setState({ authenticated })
        try {
            await bistApi.getBistWithHistory(name ,24).then(
                response => {
                    this.setState({ bist: response.data })
                    this.setState({ comments: response.data.comments })
                }
            )
        } catch (error) {
            handleLogError(error)
        }
    }

    handleChange = (e) => {
        const { id, value } = e.target
        this.setState({ [id]: value })
    }

    handleAddComment = async () => {
        const { commentText } = this.state
        if (!commentText) {
            return
        }

        const { keycloak } = this.props
        let { bist } = this.state
        const comment = { text: commentText }
        try {
            await bistApi.addBistComment(bist.name, comment, keycloak.token).then(
                response => {
                    bist = response.data
                    this.setState({ bist })
                    this.setState({ comments: response.data.comments })
                }
            )
            this.setState({ commentText: '' })
        } catch (error) {
            handleLogError(error)
        }
    }

    render() {
        const { authenticated, bist, commentText, comments } = this.state
        return (
            !bist ? <></> : (
                <Container>
                    <Grid columns={2} stackable>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <BistCommentForm
                                    authenticated={authenticated}
                                    commentText={commentText}
                                    handleAddComment={this.handleAddComment}
                                    handleChange={this.handleChange}
                                />
                                <BistComment comments={comments ? comments : []} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            )
        )
    }
}

export default withRouter(withKeycloak(BistComments))