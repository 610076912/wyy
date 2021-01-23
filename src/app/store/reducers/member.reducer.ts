import {Action, createReducer, on} from '@ngrx/store';
import {setModalType, setModalVisible} from '../actions/member.actions';

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default'
}

export type MemberState = {
  modalVisible: boolean;
  modalType: ModalTypes;
};

export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default
};

const reducer = createReducer(
  initialState,
  on(setModalVisible, (state, {modalVisible}) => ({...state, modalVisible})),
  on(setModalType, (state, {modalType}) => ({...state, modalType}))
);


export function memberReducer(state: MemberState | undefined, action: Action): MemberState {
  return reducer(state, action);
}
