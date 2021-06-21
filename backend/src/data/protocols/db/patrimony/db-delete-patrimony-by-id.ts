export interface DbDeletePatrimonyById {
  deleteById(patrimonyId: string): Promise<void>
}
