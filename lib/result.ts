type ResultStatus = "ok" | "fail"

type ResultFailure = {
  status: "fail"
  data: string
}

export interface ResultProps<Data> {
  status: ResultStatus
  data: Data
}

export class Result<Data> {
  public readonly status: ResultStatus
  public readonly data: Data

  private constructor(props: ResultProps<Data>) {
    this.status = props.status
    this.data = props.data
  }

  static ok(data: unknown): data is ResultFailure {
    return data instanceof Result && data.status === "fail"
  }

  static Fail<T>(data: T) {
    return new Result({
      status: "fail",
      data,
    })
  }
}
