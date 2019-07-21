const initState = {
    posts: []
}

const rootReducer = (state = initState, action) => {
    if (action.type === 'ADD_POST') {
        return {
            posts: [...state.posts, action.data]
        }
    }

    console.log('POST ADDED!');
}

export default rootReducer;