import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

export default props => {
  const {
    data = [],
    columns = [],
    selectRow = undefined,
    keyField = '_id',
    onTableChange = undefined,
    rowEvents = undefined,
    filter = undefined,
    remote = undefined,
  } = props;

  return (
    <BootstrapTable
      keyField={keyField}
      data={data}
      columns={columns}
      selectRow={selectRow}
      onTableChange={onTableChange}
      rowEvents={rowEvents}
      filter={filter}
      remote={remote}
      // striped
      hover
      condensed
    />
  );
};
