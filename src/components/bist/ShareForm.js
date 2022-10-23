import React from 'react'
import { Button, Form } from 'semantic-ui-react'

function ShareForm({ form, handleChange, handleSaveBist, clearForm }) {
  return (
    <Form>
      <Form.Input
        fluid
        label='Share Name *'
        id='name'
        onChange={handleChange}
        disabled={true}
        value={form.name}
      />
      <Form.Input
        fluid
        label='Amount *'
        id='amount'
        onChange={handleChange}
        value={form.amount}
      />
      <Form.Input
        fluid
        label='Total Amount *'
        id='totalAmount'
        onChange={handleChange}
        disabled={true}
        value={form.totalAmount}
      />
      <Button.Group fluid>
        <Button onClick={clearForm}>Cancel</Button>
        <Button.Or />
        <Button positive onClick={handleSaveBist}>Save</Button>
      </Button.Group>
    </Form>
  )
}

export default ShareForm