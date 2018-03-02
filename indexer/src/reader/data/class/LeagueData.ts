export default class LeagueData {
  public league_name: string
  public active: boolean = false

  constructor(league_name: string, startAt: Date, endAt: Date | null) {
    this.league_name = league_name
    this.active = this.checkIfLeagueIsActive(startAt, endAt)
  }

  private checkIfLeagueIsActive = (start: Date, end: Date | null): boolean => {
    if (end instanceof Date && start.getTime() < end.getTime())
      return false

    return true
  }
}
