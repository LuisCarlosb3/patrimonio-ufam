export interface SignInCredentials {
  registration: string
  password: string
}

export interface AuthState {
  user: {
    name: string;
    token: string;
    permission: number;
  }
}

export interface Auth extends AuthState {
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
}
