import { ACTIONS } from '../Display/Display'

const OperationButton = ( {dispatch, operation, style }) => {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: {operation}})} style={style}>{operation} </button>
  )
}

export default OperationButton