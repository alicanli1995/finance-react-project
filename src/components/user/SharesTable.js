import React from 'react'
import { Button, Image, Table } from 'semantic-ui-react'

function SharesTable({ bists, handleDeleteBist, handleEditBist }) {
  const height = window.innerHeight - 100
  const style = {
    height: height,
    maxHeight: height,
    overflowY: 'auto',
    overflowX: 'hidden'
  }

  const bistList = bists && bists.map(bist => {
    return (
      <Table.Row key={bist.name}>
        <Table.Cell collapsing>
            <div style={{marginTop: 20, marginBottom: 20, marginLeft: 15}}>
          <Button
            color='red'
            size='medium'
            icon='trash'
            onClick={() => handleDeleteBist(bist)}
          />
          <Button
            color='orange'
            size='medium'
            icon='edit'
            onClick={() => handleEditBist(bist)}
          />
            </div>
        </Table.Cell>

          <Table.Cell>
              <Image centered={"center"} size='tiny' src={`/images/${bist.name}.png` ? `/images/${bist.name}.png` : '/images/default.png'} rounded />
          </Table.Cell>
        <Table.Cell verticalAlign={"middle"} textAlign={"center"}>{bist.name}</Table.Cell>
        <Table.Cell verticalAlign={"middle"} textAlign={"center"}>{bist.amount}</Table.Cell>
        <Table.Cell verticalAlign={"middle"} textAlign={"center"}>{bist.totalAmount}</Table.Cell>
      </Table.Row>
    )
  })

  return (
    <div style={style}>
      <Table compact striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={2} textAlign={"center"}> Edit/ Delete </Table.HeaderCell>
            <Table.HeaderCell width={3} textAlign={"center"}>Logo</Table.HeaderCell>
            <Table.HeaderCell width={3} textAlign={"center"}>Name</Table.HeaderCell>
            <Table.HeaderCell width={3} textAlign={"center"}>Amount</Table.HeaderCell>
            <Table.HeaderCell width={3} textAlign={"center"}>Total Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bistList}
        </Table.Body>
      </Table>
    </div>
  )
}

export default SharesTable