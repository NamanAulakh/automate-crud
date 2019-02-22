import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default ({
  onHide,
  show,
  text = 'Delete',
  onSuccess,
  heading = 'Are you sure?',
  renderBody,
  noAction = undefined,
  extraButtons = undefined,
}) => {
  const obj = { show, onHide };

  return (
    <Modal {...obj} bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">{heading}</Modal.Title>
      </Modal.Header>

      {renderBody && <Modal.Body>{renderBody()}</Modal.Body>}

      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>

        {!noAction && (
          <Button bsStyle="primary" onClick={onSuccess}>
            {text}
          </Button>
        )}

        {!noAction && extraButtons && extraButtons()}
      </Modal.Footer>
    </Modal>
  );
};
