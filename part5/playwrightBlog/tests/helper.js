const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page) => {
  await page.getByRole('button', { name: 'New Blog' }).click()
  await page.getByTestId('title').fill('test title')
  await page.getByTestId('author').fill('test author')
  await page.getByTestId('url').fill('www.testurl.com')
  await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }