import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

const ErrorSymbol = props => {
  let actions = [
    <FlatButton
      label='Dismiss'
      primary
      onTouchTap={props.closeDialog}
    />
  ]

  if (props.suggested !== 'No suggestion') {
    actions.unshift(
      <FlatButton
        label={`Suggestion: ${props.suggested}`}
        primary
        onTouchTap={props.closeWithSuggestion}
      />
    )
  }

  return (
    <Dialog
      open={props.open}
      modal={false}
      actions={actions}
      onRequestClose={props.closeDialog}
    >
      Please verify that a correct company symbol was entered.
    </Dialog>
  )
}

ErrorSymbol.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  closeWithSuggestion: PropTypes.func.isRequired,
  suggested: PropTypes.string.isRequired
}

export default ErrorSymbol
