/* eslint-disable no-useless-escape */
// This is not a Context API file. Here many useful functions are created and exported to reduce code in our main files. Please Comment what a function does above it.

// Converts Epoch time to DateTime Object
export function ConvertTime(time) {
  const result = new Date(0)
  result.setUTCSeconds(time)
  return result
}

// Display condition for Buttons on Batch Cards
export function displayCondition(lecture) {
  const { starts, ends } = lecture
  const now = new Date().getTime() / 1000
  if (now > starts && now < ends) {
    return true
  }
  return false
}

// Display Condition for Student side (15 mins Early)
export function StudentDisplayCondition(lecture) {
  const { starts, ends } = lecture
  const early_starts = starts - 900
  const now = new Date().getTime() / 1000
  if (now > early_starts && now < ends) {
    return true
  }
  return false
}

// Converts 24-hour time to 12-hour
export function ConvertTimeTo24Hours(time) {
  const hours = parseInt(time.slice(0, 2), 10)
  if (hours > 12) {
    return `${(hours - 12).toString()}:${time.slice(3, 5)} PM`
  }
  if (hours > 0 < 1) {
    return `12${time.slice(2, 5)} AM`
  }
  if (hours === 12) {
    return `${time} PM`
  }
  return `${time} AM`
}

// returns month from month number
export function ReturnMonth(month) {
  switch (month) {
    case 0:
      return 'Jan'
    case 1:
      return 'Feb'
    case 2:
      return 'Mar'
    case 3:
      return 'Apr'
    case 4:
      return 'May'
    case 5:
      return 'Jun'
    case 6:
      return 'Jul'
    case 7:
      return 'Aug'
    case 8:
      return 'Sep'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
    default:
      break
  }
}

// Convert Hours and minutes time to a date time object
export function HoursMinutesToObject(arg) {
  const hours = parseInt(arg.slice(0, 2), 10)
  const minutes = parseInt(arg.slice(3, 5), 10)
  const res = new Date()
  res.setHours(hours, minutes, 0, 0)
  return res
}

// Convert Date Time Object to Hours and Minutes
export function ObjToHoursMinutes(arg) {
  const res = arg.toTimeString().slice(0, 5)
  return res
}

// Bad Timings Check for Schedule Class
export function CheckForBadTimings(start, end) {
  if (start.getHours() > end.getHours()) {
    return true
  }
  if (start.getHours() === end.getHours()) {
    if (start.getMinutes() > end.getMinutes()) {
      return true
    }
    if (start.getMinutes() === end.getMinutes()) {
      return true
    }
    return false
  }
  if (start.getHours() === 0 && start.getMinutes() === 0) {
    return true
  }
  return false
}

// Check For Morning, Afternoon or Evening
export function CheckForDaytime() {
  const date = new Date()
  if (date.getHours() >= 0 && date.getHours() < 12) {
    return 'Morning'
  }
  if (date.getHours() >= 12 && date.getHours() < 18) {
    return 'Afternoon'
  }
  if (date.getHours() >= 18 && date.getHours() < 24) {
    return 'Evening'
  }
}

// Check if device is mobile
export const mobileCheck = () => {
  let check = false
  ;((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4),
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

// Check of Invalid Timings
export function CheckInvalidTimings(start, end) {
  if (ObjToHoursMinutes(start) === 'Inval') {
    return true
  }
  if (ObjToHoursMinutes(end) === 'Inval') {
    return true
  }
  return false
}
