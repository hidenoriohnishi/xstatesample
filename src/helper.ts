export const tryit
  : <T>(func: (...arg: any[]) => T) => (...arg: any[]) => ([undefined, T] | [unknown, undefined])
  = <T>(func: (...arg: any[]) => T) => (...arg: any[]) => {
    try {
      const test = func(...arg)
      return [undefined, test]
    } catch (e) {
      return [e, undefined]
    }
  }