let email = '';

function changeEmail(newEmail) {
  email = newEmail;
}

function getEmail() {
  return email;
}

module.exports = {
  changeEmail, getEmail
};
