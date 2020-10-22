export const generateAltText = (displayName, imageUrl) => {
    const t = new Date()

    return `A photo shared by ${displayName} on ${t.getMonth()+1} ${t.getDate()}, ${t.getFullYear()}`
}