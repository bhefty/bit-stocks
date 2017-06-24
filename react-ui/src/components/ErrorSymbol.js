import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

const ErrorSymbol = props => {
  return (
    <Dialog
      open={props.open}
      modal={false}
      actions={[
        <FlatButton
          label='Okay'
          primary
          onTouchTap={props.closeDialog}
        />
      ]}
      onRequestClose={props.closeDialog}
    >
      Please verify that a correct company symbol was entered.
    </Dialog>
  )
}

ErrorSymbol.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired
}

export default ErrorSymbol
