import { gql, graphql } from 'react-apollo'

function Submit({ createPost }) {
  function handleSubmit(e) {
    e.preventDefault()

    let socketAmount = e.target.elements.socketAmount.value
    let url = e.target.elements.url.value

    if (socketAmount === '' || url === '') {
      window.alert('Both fields are required.')
      return false
    }

    // prepend http if missing from url
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = `http://${url}`
    }

    createPost(socketAmount, url)

    // reset form
    e.target.elements.socketAmount.value = ''
    e.target.elements.url.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Submit</h1>
      <input placeholder="socketAmount" name="socketAmount" />
      <input placeholder="url" name="url" />
      <button type="submit">Submit</button>
      <style jsx>{`
        form {
          border-bottom: 1px solid #ececec;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 20px;
        }
        input {
          display: block;
          margin-bottom: 10px;
        }
      `}</style>
    </form>
  )
}

const createPost = gql`query($socketAmount: Int) {
  allItems(condition: {socketAmount: $socketAmount}) {
    edges {
      node {
        icon
        name
        socketAmount
      }
    }
  }
}`

export default graphql(createPost, {
  props: ({ mutate }) => ({
    createPost: socketAmount =>
      mutate({
        variables: { socketAmount },
        updateQueries: {
          allPosts: (previousResult, { mutationResult }) => {
            const newPost = mutationResult.data.createPost
            return Object.assign({}, previousResult, {
              // Append the new post
              allPosts: [newPost, ...previousResult.allPosts],
            })
          },
        },
      }),
  }),
})(Submit)
