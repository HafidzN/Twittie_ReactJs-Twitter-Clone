export default function validate(values) {
  let errors = { }

  const { name, username, email, password, confirmPassword } = values
  const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/                                                                                                 //eslint-disable-line

  if(username.length === 0){
    errors.erUsername = 'Username must not be empty' 
  }

  if(name.length === 0){
    errors.erName = 'Full Name must not be empty' 
  }


  if (!email) {
    errors.erEmail = 'Email address is required'
  } else if (!emailRegex.test(email)) {   
    errors.erEmail = 'Email address is invalid'
  }


  if (!password) {
    errors.erPassword = 'Password is required'
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/.test(password)) {
    errors.erPassword = 'Password must contain atleast 8 characters, an number, an uppercase, a lowercase, and a special character'
  }


  if(password !== confirmPassword){
      errors.erPasswords = 'Passwords are not identical'
  }

  let {erName, erUsername, erEmail, erPassword, erPasswords} = errors

  if(erName){
    return erName
  } else {
    if (erUsername){
      return erUsername
    } else {
      if (erEmail){
        return erEmail
      } else {
        if (erPassword){
          return erPassword
        } else {
          if (erPasswords){
            return erPasswords
          } else {
            return ''
          }
        }
      }
    }
  }
    
}