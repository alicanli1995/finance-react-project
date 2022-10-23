import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

function ConfirmationModal({ modal }) {
  const { isOpen, header, content, onClose, onAction } = modal
  return (
    <Modal style={ {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        height: 'auto',
        margin: '0',
        padding: '0',
    }} size='tiny' open={isOpen} onClose={onClose}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        <p>{content}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          icon='thumbs down'
          content='No'
          onClick={() => onAction(false)}
        />
        <Button
          positive
          icon='thumbs up'
          labelPosition='right'
          content='Yes'
          onClick={() => onAction(true)}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ConfirmationModal