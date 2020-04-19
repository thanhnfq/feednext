import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva'
import { addFakeList, queryFakeList, removeFakeList, updateFakeList } from './service'

import { BasicListItemDataType } from './data'

export declare interface StateType {
	list: BasicListItemDataType[]
}

export type Effect = (
	action: AnyAction,
	effects: EffectsCommandMap & {
		select: <T>(func: (state: StateType) => T) => T
	},
) => void

export declare interface ModelType {
	namespace: string
	state: StateType
	effects: {
		fetch: Effect
		appendFetch: Effect
		submit: Effect
	}
	reducers: {
		queryList: Reducer<StateType>
		appendList: Reducer<StateType>
	}
}

const Model: ModelType = {
	namespace: 'topFeeders',

	state: {
		list: [],
	},

	effects: {
		*fetch({ payload }, { call, put }): Generator {
			const response = yield call(queryFakeList, payload)
			yield put({
				type: 'queryList',
				payload: Array.isArray(response) ? response : [],
			})
		},
		*appendFetch({ payload }, { call, put }): Generator {
			const response = yield call(queryFakeList, payload)
			yield put({
				type: 'appendList',
				payload: Array.isArray(response) ? response : [],
			})
		},
		*submit({ payload }, { call, put }): Generator {
			let callback
			if (payload.id) {
				callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList
			} else {
				callback = addFakeList
			}
			const response = yield call(callback, payload) // post
			yield put({
				type: 'queryList',
				payload: response,
			})
		},
	},

	reducers: {
		queryList(state, action): { list: any } {
			return {
				...state,
				list: action.payload,
			}
		},
		appendList(
			state = {
				list: [],
			},
			action,
		): { list: BasicListItemDataType[] } {
			return {
				...state,
				list: state.list.concat(action.payload),
			}
		},
	},
}

export default Model