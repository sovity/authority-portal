import {StateContext} from '@ngxs/store';
import {Patcher} from './object-utils';

export function patchState<T>(ctx: StateContext<T>, patcher: Patcher<T>) {
  const state = ctx.getState();
  const patch = patcher(state);
  ctx.patchState(patch);
}
