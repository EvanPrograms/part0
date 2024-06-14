const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => {
      console.log('bookCount query')
      Book.collection.countDocuments()

    },
    authorCount: async () => {
      Author.collection.countDocuments()
    },
    allBooks: async (root, args) => {
      const authorFilter = args.author
      console.log('Book.find')
        ? { author: await Author.findOne({ name: args.author }) }
        : {}
      const genreFilter = args.genre ? { genres: { $in: args.genre } } : {}
      return Book.find({ ...authorFilter, ...genreFilter }).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books'
          }
        },
        {
          $addFields: {
            bookCount: { $size: '$books' }
          }
        },
        {
          $project: {
            books: 0 
          }
        }
      ])
      return authors
    },
    me: async (root, args, context) => {
      const currentUser = context.currentUser
    
      if(!currentUser) {
        throw new GraphQLError('ME: User not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userWithFavoriteGenre = await User.findById(currentUser._id)

      if (!userWithFavoriteGenre) {
        throw new GraphQLError('ME: User not found', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return userWithFavoriteGenre
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      console.log('addbook resolver', args.title, args.author, args.genres, args.published)
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      
      if (args.title.length < 3) {
        throw new GraphQLError('Title is too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      if (args.author.length < 3) {
        throw new GraphQLError('Author name is too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author.name
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        
        await author.save()
      }

      try {
        const book = new Book({
          title: args.title,
          author: author._id, 
          published: args.published,
          genres: args.genres
        });
        const savedBook = await book.save();

        await author.updateOne({ $inc: { bookCount: 1 } })

        const populatedBook = await savedBook.populate('author');
  
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });
  
        return populatedBook;
      } catch (error) {
        throw new GraphQLError('Failed to add book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    editAuthor: async (roots, args) => {
      try {
        const author = await Author.findOne({ name: args.name })

        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }

        author.born = args.setBornTo
        await author.save()

        return author
      } catch (error) {
        throw new GraphQLError('Failed to edit author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers