import { atom } from 'recoil'

export interface AuthModalState {
  open: boolean
  view: 'logIn' | 'signUp' | 'resetPassword'
}

const defaultModalState: AuthModalState = {
  open: false,
  view: 'logIn',
}

export const authModalState = atom<AuthModalState>({
  key: 'authModalState',
  default: defaultModalState,
})
