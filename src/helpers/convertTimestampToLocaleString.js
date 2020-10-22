export const convertTimestampToLocaleString = (timestamp) => {
    return timestamp && new Date(timestamp.toDate()).toLocaleString([],{hour12:false})
}