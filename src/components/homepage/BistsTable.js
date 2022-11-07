import React from 'react'
import { Button, Image, Table } from 'semantic-ui-react'

function BistsTable({ bists, handleDeleteBist, handleEditBist }) {
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
          <Button
            circular
            color='red'
            size='small'
            icon='trash'
            onClick={() => handleDeleteBist(bist)}
          />
          <Button
            circular
            color='orange'
            size='small'
            icon='edit'
            onClick={() => handleEditBist(bist)}
          />
        </Table.Cell>
        <Table.Cell>{bist.name}</Table.Cell>
        <Table.Cell>{bist.value}</Table.Cell>
        <Table.Cell>{bist.dailyChangePercentage}</Table.Cell>
        <Table.Cell>{bist.dailyVolume}</Table.Cell>
        <Table.Cell>
          <Image size='tiny' src={`/images/${bist.name}.png` ? `/images/${bist.name}.png` : '/images/default.png'} rounded />
        </Table.Cell>
      </Table.Row>
    )
  })

  return (
    <div style={style}>
      <Table compact striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={2}/>
            <Table.HeaderCell width={2}>Name</Table.HeaderCell>
            <Table.HeaderCell width={4}>Value</Table.HeaderCell>
            <Table.HeaderCell width={3}>Daily Percentage</Table.HeaderCell>
            <Table.HeaderCell width={2}>Daily Volume</Table.HeaderCell>
            <Table.HeaderCell width={3}>Poster</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bistList}
        </Table.Body>
      </Table>
    </div>
  )
}

export default BistsTable