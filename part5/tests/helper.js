const loginWith = async (page, username, password) => {
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

module.exports = { loginWith }