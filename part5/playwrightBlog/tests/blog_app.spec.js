const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salad'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('login')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salad')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'incorrect username', 'incorrect password')

      await expect(page.getByText('Wrong username')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salad')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page)

      await expect(page.getByText('a blog test title by test author added')).toBeVisible()
    })

    test('Test to add likes/edit', async ({ page }) => {
      await createBlog(page)
      await page.getByRole('button', { name: 'View' }).click()
      await page.getByRole('button', { name: 'like'}).click()

      await expect(page.getByText('likes: 1 like')).toBeVisible()
    })

    test('A blog can be deleted', async ({ page }) => {
      await createBlog(page)
      await page.getByRole('button', { name: 'View' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove'}).click()

      await expect(page.getByText('test title test author')).not.toBeVisible()
      

    })
  })
})