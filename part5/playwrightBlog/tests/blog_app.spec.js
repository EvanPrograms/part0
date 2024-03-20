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
      await createBlog(page, 'test title', 'test author', 'test url')

      await expect(page.getByText('a blog test title by test author added')).toBeVisible()
    })
    describe('Multiple blog entries', () => {
      beforeEach(async ({ page, request }) => {
        await createBlog(page, 'firstTitle', 'firstAuthor', 'firstURL')
        await createBlog(page, 'secondTitle', 'secondAuthor', 'secondURL')
        await createBlog(page, 'thirdTitle', 'thirdAuthor', 'thirdURL')
      })
        
      describe('Adding filled blogs', () => {
        beforeEach(async ({ page, request }) => {
          const token = await page.evaluate(() => {
            const loggedUserJSON = window.localStorage.getItem(
              'loggedBlogappUser'
            )
            console.log('window localstorage', loggedUserJSON)
            if (loggedUserJSON) {
              console.log('Logged JSON User for test')
              return JSON.parse(loggedUserJSON).token
            } else {
              console.log('test no loggeduserjson')
            }
          })
          console.log('test print of token', token)
          await request.post('http://localhost:3003/api/blogs', {
            data: {
              title: '5 likes',
              author: 'small kid',
              url: 'www.smol.com',
              likes: 5
            },
            headers: {
              authorization: `Bearer ${token}`,
            }
          })
          await request.post('http://localhost:3003/api/blogs', {
            data: {
              title: '25 likes',
              author: 'Medium guy',
              url: 'www.middle.com',
              likes: 25
            },
            headers: {
              authorization: `Bearer ${token}`,
            }
          })
          await request.post('http://localhost:3003/api/blogs', {
            data: {
              title: 'Top likes',
              author: 'Bigman',
              url: 'www.big.com',
              likes: 98
            },
            headers: {
              authorization: `Bearer ${token}`,
            }
          })
        })
          
        test('Blogs listed in descending like order', async ({ page, request }) => {
          await page.goto('http://localhost:5173')
          await expect(
            page
              .getByTestId('parent')
              .getByTitle('blog')
              .first()
              .getByText('Top likes Bigman'))
              .toBeVisible()
          await expect(
            page
              .getByTestId('parent')
              .getByTitle('blog')
              .nth(1)
              .getByText('25 likes Medium guy'))
              .toBeVisible()
          await expect(
            page
              .getByTestId('parent')
              .getByTitle('blog')
              .nth(2)
              .getByText('5 likes small kid'))
              .toBeVisible()
          await expect(
            page
              .getByTestId('parent')
              .getByTitle('blog')
              .last()
              .getByText('thirdTitle thirdAuthor'))
              .toBeVisible()
        
        })
      })
    })
    

    describe('And a single blog has been added', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test title', 'test author', 'test url')
      })

      test('Test to add likes/edit', async ({ page }) => {
        await page.getByRole('button', { name: 'View' }).click()
        await page.getByRole('button', { name: 'like'}).click()
  
        await expect(page.getByText('likes: 1 like')).toBeVisible()
      })
  
      test('A blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'View' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove'}).click()
  
        await expect(page.getByText('test title test author')).not.toBeVisible()
      })

      test('only the creator can delete the blog', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Second User',
            username: 'seconduser',
            password: 'secondsalad'
          }
        })

        await page.getByRole('button', { name: 'logout'}).click()
        await loginWith(page, 'seconduser', 'secondsalad')
        await expect(page.getByText('test title test author')).not.toBeVisible()
      })
    })
  })
})