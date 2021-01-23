import {createAction, props} from '@ngrx/store';
import {ModalTypes} from '../reducers/member.reducer';

export const setModalVisible = createAction(
  '[member] Set modal visible',
  props<{ modalVisible: boolean }>()
);
export const setModalType = createAction(
  '[member] Set modal type',
  props<{ modalType: ModalTypes }>()
);
