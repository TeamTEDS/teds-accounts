export function abbreviateName(name: string) {
    const letters = /^[A-Za-z]+$/;

    const splitName = name.split(" ")
    
    if (splitName.length == 1) {
        return splitName[0].charAt(0).toUpperCase()
    }
  
    const c1 = splitName[0].charAt(0).toUpperCase()
    const c2 = splitName[splitName.length - 1].charAt(0).toUpperCase()
    return c1 + c2
}