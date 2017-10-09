import data from './scoreForm-fakedata.json';
import { ScoreFormActions } from '../actions';

const initialState = {
	user: {
		exercises: data.exercises,
		bonuses: data.bonuses
	}
}

export default (state = initialState, action) => {
	switch (action.type) {
		case (ScoreFormActions.Types.UpdateForm):
			console.log(state)
		break;	
		default:
			return state	
	}
}