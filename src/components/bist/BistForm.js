import React from 'react'
import { Button, Form } from 'semantic-ui-react'

function BistForm({ form, handleChange, handleSaveBist, clearForm }) {
  return (
    <Form>
      <Form.Input
        fluid
        label='Share ID *'
        id='name'
        disabled={true}
        onChange={handleChange}
        value={form.name}
        error={form.nameError}
      />
      <Form.Input
        fluid
        label='Value *'
        id='value'
        disabled={true}
        onChange={handleChange}
        value={form.value}
        error={form.valueError}
      />
      <Form.Input
        fluid
        label='Daily Percentage *'
        id='dailyChangePercentage'
        onChange={handleChange}
        disabled={true}
        value={form.dailyChangePercentage}
        error={form.dailyChangePercentageError}
      />
      <Form.Input
        fluid
        label='Daily Volume *'
        id='dailyVolume'
        disabled={true}
        onChange={handleChange}
        value={form.dailyVolume}
        error={form.dailyVolumeError}
      />
      <Form.Input
        fluid
        label='Poster'
        id='poster'
        onChange={handleChange}
        value={form.poster}
      />
      <Button.Group fluid>
        <Button onClick={clearForm}>Cancel</Button>
        <Button.Or />
        <Button positive onClick={handleSaveBist}>Save</Button>
      </Button.Group>
    </Form>
  )
}

export default BistForm