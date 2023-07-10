export class Terminal {
  username: string;
  host: string;

  constructor(
    username: string,
    host: string
  ) {
    this.username = username
    this.host = host
  }

  cwd() {
    return "~"
  }
}
