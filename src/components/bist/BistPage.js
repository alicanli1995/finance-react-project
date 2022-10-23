import React, { Component } from 'react'
import { withKeycloak } from '@react-keycloak/web'
import { Container, Grid, Header, Segment, Icon, Divider } from 'semantic-ui-react'
import {handleLogError, isAdmin} from '../misc/Helpers'
import {bistApi} from '../misc/BistApi'
import BistForm from './BistForm'
import BistsTable from './BistsTable'
import { Redirect } from 'react-router-dom'
import ConfirmationModal from '../misc/ConfirmationModal'

class BistPage extends Component {
  formInitialState = {
    name: '',
    value: '',
    dailyChangePercentage: '',
    dailyVolume: '',
    poster: '',

    nameError: false,
    valueError: false,
    dailyChangePercentageError: false,
    dailyVolumeError: false
  }

  modalInitialState = {
    isOpen: false,
    header: '',
    content: '',
    onAction: null,
    onClose: null
  }

  state = {
    bists: [],
    form: { ...this.formInitialState },
    modal: { ...this.modalInitialState },
    deleteBist: null,
  }

  async componentDidMount() {
    await this.handeGetBists()
  }

  handleChange = (e) => {
    const { id, value } = e.target
    const form = { ...this.state.form }
    form[id] = value
    this.setState({ form })
  }

  handeGetBists = async () => {
    try {
      const response = await bistApi.getBists()
      const bists = response.data
      this.setState({ bists })
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSaveBist = async () => {
    if (!this.isValidForm()) {
      return
    }

    const { keycloak } = this.props
    const { name, value, dailyChangePercentage, dailyVolume, poster } = this.state.form
    const bist = { name, value, dailyChangePercentage, dailyVolume, poster }
    try {
      await bistApi.saveBist(bist, keycloak.token)
      this.clearForm()
      await this.handeGetBists()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleDeleteBist = (bist) => {
    const modal = {
      isOpen: true,
      header: 'Delete Share',
      content: `Would you like to delete Share '${bist.name}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({ modal, deleteBist: bist })
  }

  handleEditBist = (bist) => {
    const form = {
      name: bist.name,
      value: bist.value,
      dailyChangePercentage: bist.dailyChangePercentage,
      dailyVolume: bist.dailyVolume,
      poster: bist.poster,
      nameError: false,
      valueError: false,
      dailyChangePercentageError: false,
      dailyVolumeError: false
    }
    this.setState({ form })
  }

  clearForm = () => {
    this.setState({ form: { ...this.formInitialState } })
  }

  isValidForm = () => {
    const form = { ...this.state.form }
    const nameError = form.name.trim() === ''
    const valueError = form.value.trim() === ''
    const dailyChangePercentageError = form.dailyChangePercentage.trim() === ''
    const dailyVolumeError = form.dailyVolume.trim() === ''
    form.nameError = nameError
    form.valueError = valueError
    form.dailyChangePercentageError = dailyChangePercentageError
    form.dailyVolumeError = dailyVolumeError

    this.setState({ form })
    return (!(nameError || valueError || dailyChangePercentageError || dailyVolumeError))
  }

  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props
      const { deleteBist } = this.state

      try {
        await bistApi.deleteBist(deleteBist.name, keycloak.token)
        await this.handeGetBists()
      } catch (error) {
        handleLogError(error)
      }
    }
    this.setState({ modal: { ...this.modalInitialState } })
  }

  handleCloseModal = () => {
    this.setState({ modal: { ...this.modalInitialState } })
  }

  render() {
    const { keycloak } = this.props
    if (!isAdmin(keycloak)) {
      return <Redirect to='/' />
    }

    const { bists, form, modal } = this.state
    return (
        <Container>
          <Grid>
            <Grid.Column mobile={16} tablet={16} computer={4}>
              <Segment>
                <Header as='h2'>
                  <Icon name='money' />
                  <Header.Content>Bists</Header.Content>
                </Header>
                <Divider />
                <BistForm
                    form={form}
                    handleChange={this.handleChange}
                    handleSaveBist={this.handleSaveBist}
                    clearForm={this.clearForm}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={12}>
              <BistsTable
                  bists={bists}
                  handleDeleteBist={this.handleDeleteBist}
                  handleEditBist={this.handleEditBist}
              />
            </Grid.Column>
          </Grid>

          <ConfirmationModal modal={modal} />
        </Container>
    )
  }
}

export default withKeycloak(BistPage)